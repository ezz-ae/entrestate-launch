import { prisma } from "../lib/prisma"
import {
  defaultAdminContent,
  defaultBlogPosts,
  defaultFooter,
  defaultLogos,
  defaultPricing,
  defaultProducts,
} from "../lib/marketing-defaults"

async function seedProducts() {
  for (const product of defaultProducts) {
    await prisma.marketingProduct.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        tagline: product.tagline,
        description: product.description,
        category: product.category,
        badge: product.badge,
        priceLabel: product.priceLabel,
        priceNote: product.priceNote,
        highlights: product.highlights,
        deliverables: product.deliverables,
        timeline: product.timeline,
        outcomes: product.outcomes,
        heroImage: product.heroImage,
        demoUrl: product.demoUrl,
        sortOrder: product.sortOrder,
      },
      create: {
        slug: product.slug,
        title: product.title,
        tagline: product.tagline,
        description: product.description,
        category: product.category,
        badge: product.badge,
        priceLabel: product.priceLabel,
        priceNote: product.priceNote,
        highlights: product.highlights,
        deliverables: product.deliverables,
        timeline: product.timeline,
        outcomes: product.outcomes,
        heroImage: product.heroImage,
        demoUrl: product.demoUrl,
        sortOrder: product.sortOrder,
      },
    })
  }
}

async function seedBlogPosts() {
  for (const post of defaultBlogPosts) {
    await prisma.marketingBlogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        description: post.description,
        heroImage: post.heroImage,
        publishedAt: new Date(post.publishedAt),
        content: post.content,
      },
      create: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        heroImage: post.heroImage,
        publishedAt: new Date(post.publishedAt),
        content: post.content,
      },
    })
  }
}

async function seedLogos() {
  for (const logo of defaultLogos) {
    await prisma.marketingLogo.upsert({
      where: { row_name: { row: logo.row, name: logo.name } },
      update: {
        imageUrl: logo.imageUrl,
        sortOrder: logo.sortOrder,
      },
      create: {
        name: logo.name,
        imageUrl: logo.imageUrl,
        row: logo.row,
        sortOrder: logo.sortOrder,
      },
    })
  }
}

async function seedConfigs() {
  const configs = [
    { key: "footer", data: defaultFooter },
    { key: "pricing", data: defaultPricing },
    { key: "admin-content", data: defaultAdminContent },
  ]

  for (const config of configs) {
    await prisma.marketingSiteConfig.upsert({
      where: { key: config.key },
      update: { data: config.data },
      create: { key: config.key, data: config.data },
    })
  }
}

async function main() {
  await seedProducts()
  await seedBlogPosts()
  await seedLogos()
  await seedConfigs()
}

main()
  .catch((error) => {
    console.error("[seed-marketing] Failed to seed marketing tables", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
