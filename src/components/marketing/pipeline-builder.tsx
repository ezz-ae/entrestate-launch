'use client';

import React, { useState } from 'react';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Building, Bot, Play, RotateCcw, GripVertical, X } from 'lucide-react';
import { DraggableItem } from './draggable-item';
import { DropZone } from './drop-zone';
import { SimulationPanel } from './simulation-panel';
import { cn } from '@/lib/utils';

const RESOURCES = {
  projects: [
    { id: 'p1', type: 'project', name: 'Dubai Hills Estate', icon: Building, color: 'bg-blue-500' },
    { id: 'p2', type: 'project', name: 'Palm Jumeirah Villa', icon: Building, color: 'bg-purple-500' },
    { id: 'p3', type: 'project', name: 'Downtown Loft', icon: Building, color: 'bg-indigo-500' },
  ],
  operators: [
    { id: 'o1', type: 'operator', name: 'Sarah (Qualifier)', icon: Bot, color: 'bg-emerald-500' },
    { id: 'o2', type: 'operator', name: 'Mike (Closer)', icon: Bot, color: 'bg-orange-500' },
  ]
};

export function PipelineBuilder() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ project: any; operator: any }>({
    project: null,
    operator: null,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.data.current) {
      const type = active.data.current.type;
      const item = type === 'project' 
        ? RESOURCES.projects.find(p => p.id === active.id)
        : RESOURCES.operators.find(o => o.id === active.id);

      if (item && over.id === `slot-${type}`) {
        setSlots(prev => ({ ...prev, [type]: item }));
      }
    }
  };

  const resetSlot = (type: 'project' | 'operator') => {
    setSlots(prev => ({ ...prev, [type]: null }));
    setIsSimulating(false);
  };

  const activeItem = activeId 
    ? [...RESOURCES.projects, ...RESOURCES.operators].find(i => i.id === activeId)
    : null;

  const isReady = slots.project && slots.operator;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Sidebar: Resources */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Inventory</h3>
            <div className="space-y-3">
              {RESOURCES.projects.map(item => (
                <DraggableItem key={item.id} id={item.id} type="project" className="w-full">
                  <ResourceCard item={item} />
                </DraggableItem>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">AI Operators</h3>
            <div className="space-y-3">
              {RESOURCES.operators.map(item => (
                <DraggableItem key={item.id} id={item.id} type="operator" className="w-full">
                  <ResourceCard item={item} />
                </DraggableItem>
              ))}
            </div>
          </div>
        </div>

        {/* Main Stage: Pipeline */}
        <div className="lg:col-span-9 space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
              
              {/* Slot 1: Inventory */}
              <DropZone 
                id="slot-project" 
                accept="project" 
                isFilled={!!slots.project}
                className="h-48 w-full max-w-xs rounded-xl bg-white p-1 shadow-sm dark:bg-slate-900"
              >
                {slots.project ? (
                  <div className="relative h-full w-full">
                    <button 
                      onClick={() => resetSlot('project')}
                      className="absolute right-2 top-2 rounded-full bg-slate-100 p-1 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <div className={`mb-4 rounded-full p-4 ${slots.project.color} bg-opacity-10`}>
                        <slots.project.icon className={`h-8 w-8 ${slots.project.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{slots.project.name}</h4>
                      <span className="text-xs text-slate-500">Inventory Source</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 dark:border-slate-700">
                    <Building className="mb-2 h-8 w-8 opacity-50" />
                    <span className="text-sm font-medium">Drop Project Here</span>
                  </div>
                )}
              </DropZone>

              {/* Connector */}
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="h-px w-16 bg-slate-300 dark:bg-slate-700 md:w-24" />
                <span className="text-xs font-mono uppercase">Flows To</span>
              </div>

              {/* Slot 2: Operator */}
              <DropZone 
                id="slot-operator" 
                accept="operator" 
                isFilled={!!slots.operator}
                className="h-48 w-full max-w-xs rounded-xl bg-white p-1 shadow-sm dark:bg-slate-900"
              >
                {slots.operator ? (
                  <div className="relative h-full w-full">
                    <button 
                      onClick={() => resetSlot('operator')}
                      className="absolute right-2 top-2 rounded-full bg-slate-100 p-1 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <div className={`mb-4 rounded-full p-4 ${slots.operator.color} bg-opacity-10`}>
                        <slots.operator.icon className={`h-8 w-8 ${slots.operator.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{slots.operator.name}</h4>
                      <span className="text-xs text-slate-500">Sales Operator</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 dark:border-slate-700">
                    <Bot className="mb-2 h-8 w-8 opacity-50" />
                    <span className="text-sm font-medium">Drop Operator Here</span>
                  </div>
                )}
              </DropZone>
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                disabled={!isReady}
                className={cn(
                  "flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-all",
                  isReady 
                    ? isSimulating 
                      ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                )}
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="h-4 w-4" /> Reset Simulation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Run Stack
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Results */}
          {isReady && (
            <div className={cn("transition-all duration-500", isSimulating ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 grayscale")}>
              <SimulationPanel isRunning={isSimulating} />
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
        {activeItem ? <ResourceCard item={activeItem} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function ResourceCard({ item, isOverlay }: { item: any, isOverlay?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all dark:bg-slate-900",
      isOverlay ? "border-blue-500 shadow-xl scale-105 cursor-grabbing" : "border-slate-200 hover:border-blue-400 hover:shadow-md dark:border-slate-800"
    )}>
      <div className="cursor-grab text-slate-400">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className={`rounded-md p-2 ${item.color} bg-opacity-10`}>
        <item.icon className={`h-4 w-4 ${item.color.replace('bg-', 'text-')}`} />
      </div>
      <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
    </div>
  );
}