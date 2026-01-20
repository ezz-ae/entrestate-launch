'use client';

import React from "react";
import { InteractiveAgentCreator } from "@/components/ai-tools/interactive-agent-creator";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface ChatWidgetBlockProps {
  widgetType?: 'whatsapp' | 'ai-agent';
  whatsappNumber?: string;
  position?: 'bottom-right' | 'bottom-left';
  backgroundColor?: string;
  iconColor?: string;
}

export function ChatWidgetBlock({ 
  widgetType = 'ai-agent', 
  whatsappNumber = '1234567890', // Default number for WhatsApp
  position = 'bottom-right',
  backgroundColor = '#25D366', // WhatsApp green
  iconColor = '#ffffff',
}: ChatWidgetBlockProps) {

  if (widgetType === 'whatsapp') {
    const floatPositionClasses = position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6';
    return (
      <div className={cn(
        "fixed z-50 p-3 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110",
        floatPositionClasses
      )} style={{ backgroundColor }}>
        <Link href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-6 w-6" style={{ color: iconColor }} />
        </Link>
      </div>
    );
  }

  // Default to AI Assistant
  return <InteractiveAgentCreator />;
}
