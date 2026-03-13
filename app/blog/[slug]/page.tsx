import { Container, Title, Text } from '@mantine/core';
import React from 'react';
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/appverse-footer";

const posts = [
  {
    slug: 'scaling-your-brokerage-with-ai',
    frontMatter: {
      title: 'Scaling Your Brokerage with AI: 2026 Strategy',
      date: '2026-03-12T03:28:38.742Z',
      description: 'Learn how modern real estate teams are using AI to automate lead capture and property descriptions at scale.',
      image: '/images/intuitive-1.png',
    },
  },
  {
    slug: 'why-speed-to-lead-matters',
    frontMatter: {
      title: 'Why Speed-to-Lead is the Only Metric That Matters',
      date: '2026-03-11T03:43:25.606Z',
      description: 'New data shows that responding to a lead within 5 minutes increases conversion rates by over 400%.',
      image: '/images/top-rated-1.png',
    },
  },
  {
    slug: 'luxury-branding-for-real-estate',
    frontMatter: {
      title: 'Luxury Branding: Beyond the Logo',
      date: '2026-03-10T02:47:46.420Z',
      description: 'How to create a high-end digital presence that resonates with ultra-high-net-worth investors.',
      image: '/images/intuitive-2.png',
    },
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="py-24">
        <Container size="md">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[40px] border border-white/10 mb-12 shadow-2xl">
            <Image 
              src={post.frontMatter.image} 
              alt={post.frontMatter.title} 
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs font-bold text-lime-400 uppercase tracking-[0.3em] mb-4">
            {new Date(post.frontMatter.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
            {post.frontMatter.title}
          </h1>
          <div className="prose prose-invert prose-lime max-w-none">
            <p className="text-xl text-neutral-400 leading-relaxed">
              {post.frontMatter.description}
            </p>
            {/* Actual article content would go here */}
          </div>
        </Container>
      </section>
      <AppverseFooter />
    </main>
  );
}
