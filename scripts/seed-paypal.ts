
import { createProduct, createPlan } from '../lib/paypal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create the product
    const product = await createProduct(
      'Pro Plan',
      'Unlimited access to all features'
    );
    console.log('Product created:', product);

    // Create the plan
    const plan = await createPlan(product.id, 'Pro Plan', '10.00');
    console.log('Plan created:', plan);

    // Store the plan in the database
    await prisma.paypalPlan.create({
      data: {
        planId: plan.id,
        name: plan.name,
      },
    });
    console.log('Plan stored in the database');

  } catch (error) {
    console.error('Error seeding PayPal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
