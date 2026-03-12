
import { Container, Title, Text, Button } from '@mantine/core';
import React from 'react';

const SubscriptionSuccessPage = () => {
  return (
    <Container py="xl" style={{ textAlign: 'center' }}>
      <Title order={1}>Subscription Successful!</Title>
      <Text size="lg" c="dimmed" mt="md">
        Thank you for subscribing to the Pro Plan. You now have unlimited access to all features.
      </Text>
      <Button component="a" href="/" mt="xl">
        Go to Homepage
      </Button>
    </Container>
  );
};

export default SubscriptionSuccessPage;
