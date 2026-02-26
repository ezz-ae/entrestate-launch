'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  id: string;
  accept: string;
  children: React.ReactNode;
  isFilled?: boolean;
  className?: string;
}

export function DropZone({ id, accept, children, isFilled, className }: DropZoneProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data: { accept },
  });

  const isActiveType = active?.data?.current?.type === accept;
  const isDroppable = isActiveType && !isFilled;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-all duration-200",
        isOver && isDroppable ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50 dark:bg-blue-900/20" : "",
        className
      )}
    >
      {children}
    </div>
  );
}