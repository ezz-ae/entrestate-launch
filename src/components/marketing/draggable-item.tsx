'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  id: string;
  type: string;
  data?: any;
  children: React.ReactNode;
  className?: string;
}

export function DraggableItem({ id, type, data, children, className }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type, ...data },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-none transition-opacity",
        isDragging ? "opacity-50" : "opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}