import type { DecodedIdToken } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';
import { getAdminAuth, getAdminDb } from '@/server/firebase-admin';

export type Role = 'public' | 'agent' | 'team_admin' | 'agency_admin' | 'super_admin';

export type AuthContext = {
  uid: string;
  email: string | null;
  tenantId: string;
  role: Role;
  roles: Role[];
  claims: DecodedIdToken;
};

const ROLE_PRIORITY: Role[] = ['public', 'agent', 'team_admin', 'agency_admin', 'super_admin'];
const ROLE_RANK = new Map<Role, number>(ROLE_PRIORITY.map((role, index) => [role, index]));

const isDevEnvironment = process.env.NODE_ENV !== 'production';
export const SESSION_COOKIE_NAME = 'entrestate_auth_token';
export const anonymousClaims = {
  uid: 'anonymous',
  tenantId: 'public',
  roles: ['public'],
} as unknown as DecodedIdToken;

let loggedAuthDisabledWarning = false;

function buildDevContext(req: NextRequest | Request) {
  const devUserHeader = req.headers.get('x-dev-user') || req.headers.get('x-dev-uid');
  let devUserFromCookie: string | null = null;
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('dev_user=')) {
        devUserFromCookie = decodeURIComponent(c.slice('dev_user='.length));
        break;
      }
      if (c.startsWith('dev_uid=')) {
        devUserFromCookie = decodeURIComponent(c.slice('dev_uid='.length));
        break;
      }
    }
  }

  const effectiveDevUser = devUserHeader || devUserFromCookie;
  if (!effectiveDevUser) {
    return null;
  }

  const raw = effectiveDevUser.trim();
  const email = raw.includes('@') ? raw : `${raw}@dev.local`;
  const uid = raw.includes('@') ? raw.split('@')[0] : raw;
  const rolesHeader = req.headers.get('x-dev-roles') || '';
  const normalizedRoles = rolesHeader ? normalizeRoles(rolesHeader) : [];
  const roles = normalizedRoles.length ? normalizedRoles : ['agency_admin'];

  const claims = {
    uid,
    email,
    tenantId: uid,
    roles: roles.length ? roles : ['agency_admin'],
    dev: true,
  } as unknown as DecodedIdToken;

  return { uid, email, claims };
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

function normalizeRole(value: string | null | undefined): Role | null {
  if (!value) return null;
  const raw = value.toLowerCase().replace(/[^a-z_]+/g, '');
  if (raw === 'public' || raw === 'anon' || raw === 'anonymous') return 'public';
  if (raw === 'superadmin' || raw === 'super_admin' || raw === 'root') return 'super_admin';
  if (raw === 'agencyadmin' || raw === 'agency_admin' || raw === 'owner') return 'agency_admin';
  if (raw === 'teamadmin' || raw === 'team_admin' || raw === 'editor') return 'team_admin';
  if (raw === 'admin') return 'agency_admin';
  if (raw === 'developer') return 'super_admin';
  if (raw === 'viewer' || raw === 'agent') return 'agent';
  return null;
}

function normalizeRoles(input: unknown): Role[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((value) => normalizeRole(String(value)))
      .filter(Boolean) as Role[];
  }
  if (typeof input === 'string') {
    if (input.includes(',')) {
      return input
        .split(',')
        .map((value) => normalizeRole(value.trim()))
        .filter(Boolean) as Role[];
    }
    const role = normalizeRole(input);
    return role ? [role] : [];
  }
  return [];
}

function getHighestRole(roles: Role[]): Role {
  if (!roles.length) return 'agent';
  return roles.reduce((best, current) => {
    const currentRank = ROLE_RANK.get(current) ?? 0;
    const bestRank = ROLE_RANK.get(best) ?? 0;
    return currentRank > bestRank ? current : best;
  }, roles[0]);
}

function parseCookieValue(header: string | null, name: string) {
  if (!header) return null;
  const cookies = header.split(';');
  for (const cookie of cookies) {
    const pair = cookie.trim();
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = pair.slice(0, separatorIndex).trim();
    if (key !== name) continue;
    return pair.slice(separatorIndex + 1).trim();
  }
  return null;
}

function getAuthHeader(req: NextRequest | Request) {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  const token = header.slice(7).trim();
  return token || null;
}

function getSessionToken(req: NextRequest | Request) {
  const headerToken = getAuthHeader(req);
  if (headerToken) {
    return headerToken;
  }
  const cookieHeader = req.headers.get('cookie');
  return (
    parseCookieValue(cookieHeader, SESSION_COOKIE_NAME) ||
    parseCookieValue(cookieHeader, '__session') ||
    parseCookieValue(cookieHeader, 'session')
  );
}

async function loadUserProfile(uid: string) {
  const db = getAdminDb();
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function loadTenantMember(tenantId: string, uid: string) {
  const db = getAdminDb();
  const doc = await db.collection('tenants').doc(tenantId).collection('members').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

function getClaimsTenant(claims: DecodedIdToken) {
  const raw =
    (claims as Record<string, unknown>)['tenantId'] ??
    (claims as Record<string, unknown>)['tenant'];
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

function getClaimsRoles(claims: DecodedIdToken) {
  const rawRoles = (claims as Record<string, unknown>)['roles'];
  const rawRole = (claims as Record<string, unknown>)['role'];
  const roles = normalizeRoles(rawRoles);
  if (roles.length) return roles;
  return normalizeRoles(rawRole);
}

export async function verifyFirebaseIdToken(req: NextRequest | Request) {
  try {
    const devContext = buildDevContext(req);
    const tokenString = getSessionToken(req);

    if (process.env.LOG_AUTH_DEBUG === 'true') {
      console.debug(`[auth] verifyFirebaseIdToken: FIREBASE_AUTH_ENABLED=${FIREBASE_AUTH_ENABLED}, tokenFound=${!!tokenString}`);
    }

    if (!FIREBASE_AUTH_ENABLED) {
      if (devContext) {
        return devContext;
      }
      if (isDevEnvironment && !loggedAuthDisabledWarning) {
        loggedAuthDisabledWarning = true;
        console.warn(
          '[auth] ENABLE_FIREBASE_AUTH=false; requests are treated as anonymous. Set ENABLE_FIREBASE_AUTH=true to enforce ID tokens.'
        );
      }
      return { uid: 'anonymous', email: null, claims: anonymousClaims };
    }

    if (devContext && isDevEnvironment) {
      return devContext;
    }

    if (!tokenString) {
      throw new UnauthorizedError('Missing Authorization token');
    }
    const auth = getAdminAuth();
    const claims = await auth.verifyIdToken(tokenString);
    return { uid: claims.uid, email: claims.email ?? null, claims };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      if (process.env.LOG_AUTH_DEBUG === 'true') {
        console.debug('[auth] unauthorized:', error.message);
      }
    } else {
      console.error('[auth] token verification failed', error);
    }
    throw new UnauthorizedError('Invalid token');
  }
}

async function resolveTenantAndRoles(claims: DecodedIdToken) {
  const claimTenant = getClaimsTenant(claims);
  const claimRoles = getClaimsRoles(claims);

  let tenantId = claimTenant;
  let roles = claimRoles;
  let memberProfile: Record<string, unknown> | null = null;

  if (!tenantId) {
    const profile = await loadUserProfile(claims.uid);
    const profileTenant = typeof profile?.tenantId === 'string' ? profile.tenantId : null;
    tenantId = profileTenant || claims.uid;
    if (!roles.length && profile?.role) {
      roles = normalizeRoles(profile.role);
    }
  }

  if (tenantId && !roles.length) {
    memberProfile = (await loadTenantMember(tenantId, claims.uid)) ?? null;
    if (memberProfile?.role) {
      roles = normalizeRoles(memberProfile.role);
    }
    if (memberProfile?.roles && !roles.length) {
      roles = normalizeRoles(memberProfile.roles);
    }
  }

  if (!roles.length) {
    // Fallback for super admin via UID or Email
    const isAdminUid = process.env.ADMIN_UID === claims.uid;
    const isAdminEmail = claims.email === (process.env.ADMIN_EMAIL || 'm-ezz@outlook.com');

    if (isAdminUid || isAdminEmail) {
      roles = ['super_admin'];
    } else {
      roles = tenantId === claims.uid ? ['agency_admin'] : ['agent'];
    }
  }

  return { tenantId: tenantId || claims.uid, roles };
}

export async function resolveOptionalAuth(req: NextRequest | Request): Promise<AuthContext> {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return {
        uid: 'anonymous',
        email: null,
        tenantId: 'public',
        role: 'public',
        roles: ['public'],
        claims: anonymousClaims,
      };
    }
    return await requireAuth(req);
  } catch (error) {
    if (process.env.LOG_AUTH_DEBUG === 'true') {
      console.debug('[auth] optional auth failed, treating as anonymous', error);
    }
    return {
      uid: 'anonymous',
      email: null,
      tenantId: 'public',
      role: 'public',
      roles: ['public'],
      claims: anonymousClaims,
    };
  }
}

export async function requireAuth(req: NextRequest | Request): Promise<AuthContext> {
  const { uid, email, claims } = await verifyFirebaseIdToken(req);
  const { tenantId, roles } = await resolveTenantAndRoles(claims);
  return {
    uid,
    email,
    tenantId,
    roles,
    role: getHighestRole(roles),
    claims,
  };
}

export async function requireTenant(req: NextRequest | Request): Promise<AuthContext> {
  return requireAuth(req);
}

export async function requireRole(
  req: NextRequest | Request,
  allowedRoles: Role[],
): Promise<AuthContext> {
  try {
    const context = await requireAuth(req);
    if (allowedRoles.includes('public')) {
      return context;
    }
    const hasRole = context.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError('Role access denied');
    }
    return context;
  } catch (error) {
    if (error instanceof UnauthorizedError && allowedRoles.includes('public')) {
      return {
        uid: 'anonymous',
        email: null,
        tenantId: 'public',
        role: 'public',
        roles: ['public'],
        claims: {} as DecodedIdToken,
      };
    }
    throw error;
  }
}
