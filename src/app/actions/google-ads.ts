'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getUserProjects() {
  const supabase = createSupabaseServerClient();
  // Fetch projects to populate the dropdown
  const { data } = await supabase
    .from('projects')
    .select('id, headline, description, original_filename')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function generateAdConfig(projectId: string) {
  const supabase = createSupabaseServerClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (!project) throw new Error("Project not found");

  // Simulate AI Analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real scenario, this would call OpenAI. 
  // We return structured data for the dashboard.
  return {
    headlines: [
      project.headline?.slice(0, 30) || "Luxury Apartments",
      "Official Launch",
      "High ROI Investment"
    ],
    descriptions: [
      project.description?.slice(0, 90) || "Discover premium living spaces designed for comfort and style.",
      "Register your interest today for exclusive offers and payment plans."
    ],
    baseKeywords: [
      "buy apartment",
      "real estate investment",
      "luxury property",
      "off plan projects"
    ]
  };
}