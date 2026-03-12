'use client';

import { Card, Image, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';

interface BlogCardProps {
  post: {
    slug: string;
    frontMatter: {
      title: string;
      date: string;
      description: string;
      image: string;
    };
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={post.frontMatter.image}
          height={160}
          alt={post.frontMatter.title}
        />
      </Card.Section>

      <Text size="sm" color="dimmed" mt="md">
        {new Date(post.frontMatter.date).toLocaleDateString()}
      </Text>

      <Text weight={500} mt="xs">{post.frontMatter.title}</Text>

      <Text size="sm" color="dimmed" mt="sm">
        {post.frontMatter.description}
      </Text>

      <Button component={Link} href={`/blog/${post.slug}`} variant="light" color="blue" fullWidth mt="md" radius="md">
        Read more
      </Button>
    </Card>
  );
}
