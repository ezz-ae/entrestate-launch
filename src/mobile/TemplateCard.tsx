import React from 'react';
import Image from 'next/image';

type TemplateCardProps = {
  title: string;
  category?: string;
  image?: string | null;
  onSelect?: () => void;
  onLongPress?: () => void;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ title, category, image, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-white/10"
    >
      <div className="relative h-44 bg-zinc-900 flex items-center justify-center text-zinc-400">
        {image ? (
          <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <span className="text-sm">📷 Template Preview</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        {category && <p className="text-xs text-zinc-400">{category}</p>}
      </div>
    </div>
  );
};

export default TemplateCard;