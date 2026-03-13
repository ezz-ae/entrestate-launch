import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const configureEnvironment = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

export const client = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export async function createProduct(name, description, type = 'DIGITAL') {
  const request = new checkoutNodeJssdk.products.ProductsCreateRequest();
  request.requestBody({
    name,
    description,
    type,
    category: 'SOFTWARE',
  });

  const response = await client().execute(request);
  return response.result;
}

export async function createPlan(productId, name, amount, interval = 'MONTH') {
  const request = new checkoutNodeJssdk.plans.PlansCreateRequest();
  request.requestBody({
    product_id: productId,
    name,
    billing_cycles: [
      {
        frequency: {
          interval_unit: interval,
          interval_count: 1,
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: amount,
            currency_code: 'USD',
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3,
    },
  });

  const response = await client().execute(request);
  return response.result;
}

export async function createSubscription(planId, userEmail) {
  const request = new checkoutNodeJssdk.subscriptions.SubscriptionsCreateRequest();
  request.requestBody({
    plan_id: planId,
    subscriber: {
      email_address: userEmail,
    },
    application_context: {
      brand_name: 'NanoGPT',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'SUBSCRIBE_NOW',
      return_url: `${process.env.NEXTAUTH_URL}/api/subscribe/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/api/subscribe/cancel`,
    },
  });

  const response = await client().execute(request);
  const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

  return approvalUrl;
}

export async function captureSubscription(subscriptionId) {
  const request = new checkoutNodeJssdk.subscriptions.SubscriptionsCaptureRequest(subscriptionId);
  request.requestBody({});

  const response = await client().execute(request);
  return response.result;
}

export async function createOrder(amount, currency = 'AED') {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
    application_context: {
      brand_name: 'Mashroi',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXTAUTH_URL}/api/payments/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/api/payments/cancel`,
    },
  });

  const response = await client().execute(request);
  return response.result;
}
