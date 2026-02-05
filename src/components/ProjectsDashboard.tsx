'use client';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import clsx from 'clsx';

type ProjectData = { id: string; title: string; city: string; status: string; developer?: string; price?: number };
type ProjectFilters = { query?: string; city?: string; status?: string; developer?: string; minPrice?: number; maxPrice?: number };

interface ApiResponse {
  ok: boolean;
  data: {
    items: ProjectData[];
    nextCursor: string | null;
    totalApprox?: number;
  };
}

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [totalApprox, setTotalApprox] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [source, setSource] = useState<'auto' | 'firestore' | 'static'>('auto');
  const [newlyLoadedIds, setNewlyLoadedIds] = useState<Set<string>>(new Set());

  const loadProjects = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (cursor) params.set('cursor', cursor);
      Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && params.set(k, String(v)));
      if (source !== 'auto') params.set('useStatic', source === 'static' ? 'true' : 'false');

      const res = await fetch(`/api/projects/search?${params.toString()}`);
      const data: ApiResponse = await res.json();
      if (data.ok && Array.isArray(data.data.items)) {
        const newIds = new Set(data.data.items.map(p => p.id));
        setNewlyLoadedIds(newIds);
        setProjects(prev => [...prev, ...data.data.items]);
        setCursor(data.data.nextCursor || null);
        setHasMore(Boolean(data.data.nextCursor));
        setTotalApprox(data.data.totalApprox ?? totalApprox);
      } else setHasMore(false);
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore, filters, source, totalApprox]);

  // Reset when filters or source change
  useEffect(() => {
    setProjects([]);
    setCursor(null);
    setHasMore(true);
    loadProjects();
  }, [filters, source]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 && hasMore && !loading) loadProjects();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadProjects, hasMore, loading]);

  const handleFilterChange = debounce((newFilters: ProjectFilters) => setFilters(newFilters), 500);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Sticky filters */}
      <div className="sticky top-0 bg-white z-10 flex flex-wrap gap-3 mb-6 p-2 border-b shadow-sm rounded">
        <input placeholder="City" onChange={e => handleFilterChange({ ...filters, city: e.target.value })} className="border p-2 rounded flex-1 min-w-[120px]"/>
        <input placeholder="Status" onChange={e => handleFilterChange({ ...filters, status: e.target.value })} className="border p-2 rounded flex-1 min-w-[120px]"/>
        <input placeholder="Developer" onChange={e => handleFilterChange({ ...filters, developer: e.target.value })} className="border p-2 rounded flex-1 min-w-[120px]"/>
        <div className="flex gap-2">
          {['auto','firestore','static'].map(s => (
            <button key={s} className={clsx('px-3 py-1 rounded border transition', source===s ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:bg-gray-100')} onClick={()=>setSource(s as any)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Project cards */}
      <div className="projects-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map(p => (
          <div
            key={p.id}
            className={clsx(
              'project-card border p-4 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-white',
              newlyLoadedIds.has(p.id) ? 'opacity-0 animate-fade-in' : 'opacity-100'
            )}
          >
            <h3 className="font-bold text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.city} • {p.status}</p>
            {p.developer && <p className="text-sm text-gray-500 mt-1">Developer: {p.developer}</p>}
            {p.price && <p className="text-sm text-gray-700 mt-1 font-medium">Price: {p.price}</p>}
          </div>
        ))}

        {/* Skeletons */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="border p-4 rounded-lg shadow animate-pulse bg-gray-200 h-32"/>
          ))
        }
      </div>

      {/* Footer: Load More + Progress */}
      <div className="mt-6 flex flex-col items-center gap-2">
        {projects.length > 0 && (
          <>
            <p className="text-sm text-gray-500">
              Showing {projects.length}{totalApprox ? ` of ${totalApprox}` : hasMore ? '+' : ''} projects
            </p>

            {hasMore && !loading && (
              <button
                className="px-6 py-2 border rounded shadow bg-blue-500 text-white hover:bg-blue-600 transition"
                onClick={loadProjects}
              >
                Load More
              </button>
            )}

            {!hasMore && <p className="text-gray-500">All projects loaded</p>}

            {(totalApprox || projects.length > 0) && (
              <div className="w-full max-w-md bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="h-2 bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (projects.length / (totalApprox || (projects.length + (hasMore ? 12 : 0)))) * 100)}%`,
                  }}
                />
              </div>
            )}
          </>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && projects.length === 0 && <p className="text-gray-500">No projects found</p>}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
      `}</style>
    </div>
  );
}