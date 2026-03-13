
import { NextResponse } from 'next/server';
import { createOrder } from '../../../../../lib/paypal';

export async function POST(request: Request) {
  try {
    const { amount, productTitle } = await request.json();

    // In a real app, you would validate the amount based on the productTitle
    // and potentially create a record in your DB.

    const order = await createOrder(amount || "2399");

    const approvalUrl = order.links.find((link: any) => link.rel === 'approve').href;

    return NextResponse.json({ approvalUrl });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}
