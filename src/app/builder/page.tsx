import { Suspense } from 'react';
import BuilderClient from './builder-client';
import { prisma } from '@/server/db';
import type { ProjectData } from '@/lib/types';

export default async function BuilderPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ projectId?: string }> 
}) {
  const { projectId } = await searchParams;
  let initialData: ProjectData | null = null;

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (project) {
      const dataJson = project.dataJson as ProjectData | null;
      initialData = dataJson && typeof dataJson === 'object'
        ? { ...dataJson, id: project.id, name: project.title || dataJson.name }
        : {
            id: project.id,
            name: project.title || 'Untitled Project',
            developer: project.developer || undefined,
            location: project.city
              ? {
                  city: project.city,
                  area: project.community || project.city,
                }
              : undefined,
          };
    }
  }

  return (
    <Suspense fallback={null}>
      <BuilderClient initialProjectData={initialData} />
    </Suspense>
  );
}
