'use client';

import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    description: string;
    provider: string;
    iconUrl: string | null;
    iconLabel: string;
    examples: {
      type: string;
      src: string;
      alt: string;
      prompt?: string;
      settingsText?: string;
    }[];
    dateAdded: string;
    usageCount: number;
    approximatePromptPrice: number;
    tags: string[] | undefined;
    category: string | undefined;
    censored: boolean | undefined;
  };
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={model.examples[0].src}
          height={160}
          alt={model.examples[0].alt}
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{model.name}</Text>
        {model.tags && (
          <Badge color="teal" variant="light">
            {model.tags.includes('text-to-image') && model.tags.includes('image-edit') ? 'Text & Image' :
             model.tags.includes('text-to-image') ? 'Text to Image' :
             model.tags.includes('image-edit') ? 'Image to Image' :
             model.tags[0]
            }
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        {model.description}
      </Text>

      <Text size="xs" color="dimmed" mt="sm">
        ~ ${model.approximatePromptPrice.toFixed(3)} per image
      </Text>

      <Button component="a" href={`/media?mode=image&model=${model.id}`} variant="light" color="blue" fullWidth mt="md" radius="md">
        Try it out
      </Button>
    </Card>
  );
}
