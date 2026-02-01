export interface LeadProject {
  headline?: string | null;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status?: string | null;
  created_at: string;
  notes?: string | null;
  projects?: LeadProject | null;
}
