'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight } from 'lucide-react';

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
      <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 backdrop-blur-xl transition-all duration-500 hover:border-lime-400/30 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={post.frontMatter.image}
            alt={post.frontMatter.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
            <Calendar className="h-3 w-3 text-lime-400" />
            {new Date(post.frontMatter.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-lime-300 transition-colors leading-tight">
            {post.frontMatter.title}
          </h3>
          
          <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-2">
            {post.frontMatter.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs font-black text-lime-400 uppercase tracking-tighter">
            Read Article
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
