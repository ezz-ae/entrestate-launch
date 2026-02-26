import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NEXTAUTH_SECRET } from '@/lib/server/env';

export type Role = 'public' | 'agent' | 'team_admin' | 'agency_admin' | 'super_admin';

export type AuthClaims = {
  uid?: string;
  email?: string | null;
  tenantId?: string;
  role?: string;
  roles?: string[];
  dev?: boolean;
  [key: string]: unknown;
};

export type AuthContext = {
  uid: string;
  email: string | null;
  tenantId: string;
  role: Role;
  roles: Role[];
  claims: AuthClaims;
};

const ROLE_PRIORITY: Role[] = ['public', 'agent', 'team_admin', 'agency_admin', 'super_admin'];
const ROLE_RANK = new Map<Role, number>(ROLE_PRIORITY.map((role, index) => [role, index]));
const isDevEnvironment = process.env.NODE_ENV !== 'production';
const anonymousClaims: AuthClaims = {
  uid: 'anonymous',
  tenantId: 'public',
  roles: ['public'],
};

function getHighestRole(roles: Role[]): Role {
  if (!roles.length) return 'agent';
  return roles.reduce((best, current) => {
    const currentRank = ROLE_RANK.get(current) ?? 0;
    const bestRank = ROLE_RANK.get(best) ?? 0;
    return currentRank > bestRank ? current : best;
  }, roles[0]);
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
  const roles = ['agency_admin'];

  const claims: AuthClaims = {
    uid,
    email,
    tenantId: uid,
    roles,
    dev: true,
  };

  return { uid, email, tenantId: uid, roles, role: 'agency_admin' as Role, claims };
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

async function getSessionToken(req: NextRequest | Request) {
  if (!NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not configured');
  }
  const nextReq = req instanceof NextRequest ? req : new NextRequest(req);
  const token = await getToken({ req: nextReq, secret: NEXTAUTH_SECRET });
  return token;
}

export async function verifyFirebaseIdToken(req: NextRequest | Request) {
  try {
    const devContext = buildDevContext(req);
    if (devContext) {
      return devContext;
    }

    const token = await getSessionToken(req);
    if (!token || typeof token.sub !== 'string') {
      throw new UnauthorizedError('Missing session token');
    }

    const claims: AuthClaims = {
      uid: token.sub,
      email: token.email ?? null,
      tenantId: token.tenantId,
      role: token.role,
      roles: token.roles,
    };

    return {
      uid: token.sub,
      email: token.email ?? null,
      claims,
      tenantId: token.tenantId ?? token.sub,
      roles: normalizeRoles(claims.roles ?? (claims.role ? [claims.role] : [])),
      role: getHighestRole(
        normalizeRoles(claims.roles ?? (claims.role ? [claims.role] : [])) as Role[],
      ),
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid session');
  }
}

function resolveTenantAndRoles(claims: AuthClaims) {
  const tenantId = claims.tenantId ?? claims.uid ?? 'public';
  const roles = normalizeRoles(claims.roles ?? (claims.role ? [claims.role] : []));
  const finalRoles: Role[] = roles.length ? roles : ['agency_admin'];
  return { tenantId, roles: finalRoles };
}

export async function requireAuth(req: NextRequest | Request): Promise<AuthContext> {
  const context = await verifyFirebaseIdToken(req);
  const { tenantId, roles } = resolveTenantAndRoles(context.claims);
  return {
    uid: context.uid,
    email: context.email,
    tenantId,
    roles,
    role: getHighestRole(roles as Role[]),
    claims: context.claims,
  };
}

export async function requireTenant(req: NextRequest | Request): Promise<AuthContext> {
  return requireAuth(req);
}

export async function requireRole(req: NextRequest | Request, allowedRoles: Role[]) {
  try {
    const context = await requireAuth(req);
    if (allowedRoles.includes('public')) {
      return context;
    }
    const hasRole = context.roles.some((role) => allowedRoles.includes(role));
    if (isDevEnvironment) {
      console.log(
        `[auth] Role check: user=${context.uid} roles=[${context.roles.join(
          ',',
        )}] required=[${allowedRoles.join(',')}] result=${hasRole}`,
      );
    }
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
        claims: anonymousClaims,
      };
    }
    throw error;
  }
}

export { UnauthorizedError, ForbiddenError };
