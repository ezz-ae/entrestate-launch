'use client';

import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

import { MarketingMediaFrame } from '@/components/marketing-media-frame';

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
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#CBB57A]/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
        <div className="relative h-56 w-full overflow-hidden">
          <MarketingMediaFrame
            src={post.frontMatter.image}
            alt={post.frontMatter.title}
            chrome
            fit="contain"
            className="h-full w-full"
            contentClassName="p-4 pt-12"
            imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
            <Calendar className="h-3 w-3 text-[#CBB57A]" />
            {new Date(post.frontMatter.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          
          <h3 className="mb-4 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-[#CBB57A]">
            {post.frontMatter.title}
          </h3>
          
          <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-2">
            {post.frontMatter.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-[#CBB57A]">
            Read Article
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
