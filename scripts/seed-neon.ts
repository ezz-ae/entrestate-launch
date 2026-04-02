import bcrypt from 'bcryptjs';
import { prisma } from '../src/server/db';

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-dev' },
    update: { name: 'Dev Tenant' },
    create: { id: 'tenant-dev', name: 'Dev Tenant' },
  });

  const passwordHash = await bcrypt.hash('Password123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@mtcmartech.test' },
    update: {
      passwordHash,
      role: 'agency_admin',
      tenantId: tenant.id,
    },
    create: {
      email: 'admin@mtcmartech.test',
      role: 'agency_admin',
      passwordHash,
      tenantId: tenant.id,
    },
  });

  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        tenantId: tenant.id,
        slug: 'skyline-residences',
        title: 'Skyline Residences',
        city: 'Dubai',
        community: 'Downtown',
        developer: 'EntreState Developments',
        priceMin: 850000,
        priceMax: 1300000,
        rentalYield: 6.5,
        sortScore: 100,
        firstPage: true,
        imagesJson: { hero: 'https://example.com/skyline.jpg' },
        dataJson: { bedrooms: [1, 2, 3] },
      },
    ],
  });

  await prisma.lead.createMany({
    skipDuplicates: true,
    data: [
      {
        tenantId: tenant.id,
        projectId: null,
        name: 'Mira Patel',
        email: 'mira@example.com',
        phone: '+971501234567',
        status: 'new',
        source: 'landing_page',
      },
    ],
  });

  await prisma.campaign.createMany({
    skipDuplicates: true,
    data: [
      {
        tenantId: tenant.id,
        platform: 'google_ads',
        name: 'Dubai Launch',
        utmSource: 'google',
        utmCampaign: 'dubai_launch',
        spend: 1200,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error('[seed] Failed to seed neon db', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
