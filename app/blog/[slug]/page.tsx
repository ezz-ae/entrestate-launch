
import { Container, Title, Text, Image } from '@mantine/core';
import React from 'react';

const posts = [
  {
    slug: 'how-to-detect-and-block-malicious-bots-in-apis',
    frontMatter: {
      title: 'How to Detect and Block Malicious Bots in APIs',
      date: '2026-03-12T03:28:38.742Z',
      description: 'Layer IP reputation, behavioral analysis, rate limits, TLS fingerprints, and CAPTCHAs to detect and block malicious bots targeting your APIs.',
      image: 'https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/nano-gpt.com/69b205c712de151ab0291894-1773286219583.jpg',
    },
  },
  {
    slug: 'ai-model-testing-protocols-best-practices',
    frontMatter: {
      title: 'AI Model Testing Protocols: Best Practices',
      date: '2026-03-11T03:43:25.606Z',
      description: 'Practical guidelines for testing AI models: define objectives, build golden datasets, run edge-case and adversarial tests, version control, and monitor drift.',
      image: 'https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/nano-gpt.com/69b0b4a512de151ab028e440-1773200688688.jpg',
    },
  },
  {
    slug: 'ultimate-ai-model-storage-needs-guide',
    frontMatter: {
      title: 'Ultimate Guide to AI Model Storage Needs',
      date: '2026-03-10T02:47:46.420Z',
      description: 'Practical guide to AI storage: VRAM/RAM sizing, NVMe vs HDD, checkpoints, object storage, and caching strategies to prevent GPU stalls and cut costs.',
      image: 'https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/nano-gpt.com/69af613412de151ab028a43a-1773110938501.jpg',
    },
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Container py="xl">
      <Title order={1}>{post.frontMatter.title}</Title>
      <Text size="sm" color="dimmed" mt="md">
        {new Date(post.frontMatter.date).toLocaleDateString()}
      </Text>
      <Image src={post.frontMatter.image} alt={post.frontMatter.title} my="xl" />
      <Text>{post.frontMatter.description}</Text>
    </Container>
  );
};

export default BlogPostPage;
