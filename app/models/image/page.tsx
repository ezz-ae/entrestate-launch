'use client';

import { Container, Title, Text, Tabs, TextInput, Select, SimpleGrid, Group } from '@mantine/core';
import React from 'react';
import { ModelCard } from '@/components/models/model-card';

const models = [
  {
    id: 'nano-banana-2-fast',
    name: 'Nano Banana 2 Fast',
    description: 'Google Nano Banana 2 Fast (Gemini 3.1 Flash Image) is the cheaper Nano Banana 2 variant for unified text-to-image and image editing, with 2K default output, 4K support, and flexible aspect ratios.',
    provider: 'gemini',
    iconUrl: '/icons/Gemini.svg',
    iconLabel: 'both',
    examples: [
      {
        type: 'image',
        src: 'https://d2p7pge43lyniu.cloudfront.net/output/6f59a5cd-02ce-45f7-b20c-f981d0318c56.png',
        alt: 'Cinematic portrait in rainy Tokyo street',
      },
    ],
    dateAdded: '2026-03-06',
    usageCount: 0,
    approximatePromptPrice: 0.045,
    tags: ['text-to-image', 'image-edit', '4k', 'fast'],
    category: undefined,
    censored: undefined,
  },
  {
    id: 'qwen-image-2.0',
    name: 'Qwen Image 2.0',
    description: "Alibaba's Qwen Image 2.0 model for text-to-image and image edits. Strong prompt following, multilingual text rendering, and support for up to 4 reference images.",
    provider: 'qwen',
    iconUrl: '/icons/Qwen.svg',
    iconLabel: 'both',
    examples: [
      {
        type: 'image',
        src: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/c272607ae7fc4e8183ca16b4e7669abd/1.jpg',
        alt: 'Ancient tree growing through collapsed cathedral',
      },
    ],
    dateAdded: '2026-03-03',
    usageCount: 0,
    approximatePromptPrice: 0.027,
    tags: ['text-to-image', 'image-edit', 'qwen', 'alibaba'],
    category: undefined,
    censored: undefined,
  },
  {
    id: 'qwen-image-2.0-pro',
    name: 'Qwen Image 2.0 Pro',
    description: "Alibaba's premium Qwen Image 2.0 Pro model for high-fidelity text-to-image and advanced image editing workflows.",
    provider: 'qwen',
    iconUrl: '/icons/Qwen.svg',
    iconLabel: 'both',
    examples: [
      {
        type: 'image',
        src: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/9b3c0448de5d47638b1332847c7c0fa4/1.jpg',
        alt: 'Abandoned Art Deco cinema interior',
      },
    ],
    dateAdded: '2026-03-03',
    usageCount: 0,
    approximatePromptPrice: 0.063,
    tags: ['text-to-image', 'image-edit', 'qwen', 'alibaba'],
    category: undefined,
    censored: undefined,
  },
];

const ModelsPage = () => {
  return (
    <Container py="xl">
      <Title order={1}>Explore Image Models</Title>
      <Text size="sm" c="dimmed">Discover AI image generation models for your creative projects</Text>

      <Tabs defaultValue="image" mt="lg">
        <Tabs.List>
          <Tabs.Tab value="image">Images</Tabs.Tab>
          <Tabs.Tab value="video">Videos</Tabs.Tab>
          <Tabs.Tab value="text">Text</Tabs.Tab>
          <Tabs.Tab value="audio">Audio</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="image" pt="xs">
          <Group mt="md" mb="lg">
            <TextInput
              placeholder="Search image models..."
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Sort by"
              data={['Newest', 'Popularity', 'Price']}
            />
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ModelsPage;
