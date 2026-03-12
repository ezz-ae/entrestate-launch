'use client';

import { Container, Title, Text, Card, Button } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const SubscribePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    const res = await fetch('/api/subscribe', {
      method: 'POST',
    });
    const data = await res.json();

    if (data.approvalUrl) {
      router.push(data.approvalUrl);
    }
  };

  return (
    <Container py="xl">
      <Title order={1}>Subscribe to Pro Plan</Title>
      <Text size="lg" c="dimmed">Get unlimited access to all features.</Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Title order={2}>Pro Plan</Title>
        <Text size="xl" weight={700} mt="md">$10/month</Text>
        <Text mt="md">
          - Unlimited access to all AI models
          - Priority support
          - Early access to new features
        </Text>
        <Button fullWidth mt="xl" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </Card>
    </Container>
  );
};

export default SubscribePage;
