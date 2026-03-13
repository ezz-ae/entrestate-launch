import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { captureOrder } from '../../../../lib/paypal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token'); // This is the orderID from PayPal

  if (!token) {
    return NextResponse.json({ error: 'PayPal token is missing' }, { status: 400 });
  }

  try {
    const captureData = await captureOrder(token);
    
    // Here you would save the successful payment to your database
    // For example:
    const payment = await prisma.payment.create({
      data: {
        paymentId: captureData.id,
        status: captureData.status,
        amount: Number(captureData.purchase_units[0].amount.value),
        currency: captureData.purchase_units[0].amount.currency_code,
        // You'd need a way to associate this with a user/tenant
        // tenantId: "some-tenant-id", 
      },
    });

    // Redirect to the success page
    return NextResponse.redirect(new URL('/subscribe/success', request.url));
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    // Redirect to a failure page or show an error
    return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 });
  }
}
