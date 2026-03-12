
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { createSubscription } from '../../../lib/paypal';

const prisma = new PrismaClient();

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const proPlan = await prisma.paypalPlan.findFirst({
      where: {
        name: 'Pro Plan',
      },
    });

    if (!proPlan) {
      return new Response('Plan not found', { status: 404 });
    }

    const approvalUrl = await createSubscription(proPlan.planId, session.user.email);

    return new Response(JSON.stringify({ approvalUrl }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
