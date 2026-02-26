import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const payload = registerSchema.parse(await req.json());
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    const tenant = await prisma.tenant.create({
      data: {
        name: payload.name ?? normalizedEmail,
      },
    });
    const passwordHash = await bcrypt.hash(payload.password, 10);
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: 'agency_admin',
        tenantId: tenant.id,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const message = error?.message || 'Invalid payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
