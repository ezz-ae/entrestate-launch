'use client';

import { Container, Title, Text, Accordion } from '@mantine/core';
import React from 'react';
import { PricingTable } from '@/components/pricing/pricing-table';

const textModelsHeaders = ['Model Name', 'API Name', 'Input Cost / 1M tokens', 'Output Cost / 1M tokens'];
const textModelsData = [
  ['GPT-4', 'gpt-4', '$10.00', '$30.00'],
  ['GPT-3.5 Turbo', 'gpt-3.5-turbo', '$0.50', '$1.50'],
];

const imageModelsHeaders = ['Model Name', 'API Name', 'Resolution', 'Cost per Image'];
const imageModelsData = [
  ['Nano Banana 2 Fast', 'nano-banana-2-fast', '2K', '$0.045'],
  ['Qwen Image 2.0', 'qwen-image-2.0', '1K', '$0.027'],
];

const PricingPage = () => {
  return (
    <Container py="xl">
      <Title order={1}>AI Model Pricing — Pay Per Prompt</Title>
      <Text size="lg" c="dimmed">Pay only for what you use.</Text>

      <Accordion defaultValue="pricing-example" mt="xl">
        <Accordion.Item value="pricing-example">
          <Accordion.Control>How Pricing Works</Accordion.Control>
          <Accordion.Panel>
            <Text>Pricing is based on tokens (roughly 3 words ≈ 4 tokens). You pay for input tokens (what you send) and output tokens (what the AI responds).</Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="text-model-pricing">
          <Accordion.Control>Text Model Pricing</Accordion.Control>
          <Accordion.Panel>
            <PricingTable headers={textModelsHeaders} data={textModelsData} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="image-model-pricing">
          <Accordion.Control>Image Model Pricing</Accordion.Control>
          <Accordion.Panel>
            <PricingTable headers={imageModelsHeaders} data={imageModelsData} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default PricingPage;
