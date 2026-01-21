'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef } from 'react';

export function LeadsSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  };

  return (
    <div className="relative w-full md:w-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <input
        className="h-10 w-full md:w-[300px] rounded-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        placeholder="Search leads..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}