'use client';

import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, Users, Activity } from 'lucide-react';
import type { ProjectData } from '@/lib/types';

interface InventoryExplorerProps {
  initialProjects: ProjectData[];
}

export function InventoryExplorer({ initialProjects }: InventoryExplorerProps) {
  const [filter, setFilter] = useState('');
  
  const filteredProjects = initialProjects.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.location?.city?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Operational Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, city, or developer..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Activity className="h-4 w-4" />
            Sort by Demand
          </button>
        </div>
      </div>

      {/* Live Inventory Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
          >
            {/* Image & Status */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              {project.images?.[0] ? (
                <img 
                  src={project.images[0]} 
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {project.status || 'Available'}
              </div>
            </div>

            {/* Operational Data */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.name}</h3>
                <p className="text-sm text-slate-500">{project.location?.area}, {project.location?.city}</p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <div>
                  <span className="block text-xs text-slate-500">Starting Price</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{project.price?.label || 'TBD'}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">ROI Potential</span>
                  <span className="font-semibold text-green-600">{project.performance?.roi ? `${project.performance.roi}%` : 'High'}</span>
                </div>
              </div>

              {/* Live Signals */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>12 Active Agents</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Activity className="h-3 w-3" />
                    <span>High Demand</span>
                  </div>
                </div>
                <button className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-400">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}