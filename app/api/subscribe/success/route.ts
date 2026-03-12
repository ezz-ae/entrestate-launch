
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { captureSubscription } from '../../../../lib/paypal';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const subscriptionId = req.nextUrl.searchParams.get('subscription_id');

  if (!subscriptionId) {
    return new Response('Subscription ID not found', { status: 400 });
  }

  try {
    await captureSubscription(subscriptionId);

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        role: 'pro',
      },
    });

    return NextResponse.redirect(new URL('/subscribe/success', req.url));
  } catch (error) {
    console.error('Error capturing subscription:', error);
    return new Response('Internal ServerError', { status: 500 });
  }
}
