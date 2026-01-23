'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
}

export function Pagination({ currentPage, hasNextPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handlePageChange = (page: number) => {
    // searchParams can be null, so fallback to empty string
    const params = new URLSearchParams(searchParams ?? '');
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 border-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-zinc-400">Page {currentPage}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="h-8 w-8 border-zinc-800"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}