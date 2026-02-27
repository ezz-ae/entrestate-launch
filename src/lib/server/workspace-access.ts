import { createHash, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export function getWorkspaceCookieName(orderId: string) {
  return `ws_${orderId}`;
}

export function hashWorkspaceToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateWorkspaceToken() {
  const token = randomBytes(24).toString('hex');
  return { token, tokenHash: hashWorkspaceToken(token) };
}

export async function hasWorkspaceAccess(orderId: string, token?: string | null) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { metaJson: true },
  });

  const tokenHash =
    order && order.metaJson && typeof order.metaJson === 'object'
      ? (order.metaJson as Record<string, unknown>).workspaceTokenHash
      : null;

  if (!tokenHash) {
    return true;
  }

  if (!token) {
    return false;
  }

  return hashWorkspaceToken(token) === tokenHash;
}

export async function requireWorkspaceAccess(req: NextRequest, orderId: string) {
  const cookieName = getWorkspaceCookieName(orderId);
  const token =
    req.cookies.get(cookieName)?.value || req.headers.get('x-workspace-token') || null;

  const allowed = await hasWorkspaceAccess(orderId, token);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'workspace_forbidden' }, { status: 403 });
  }
  return null;
}
