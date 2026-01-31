export interface ProjectData {
  id: string;
  name: string;
  developer?: string;
  status?: string;
  price?: {
    label: string;
    value?: number;
  };
  location?: {
    city: string;
    area: string;
  };
  images?: string[];
  performance?: {
    roi?: number;
    capitalAppreciation?: number;
  };
  handover?: {
    quarter: number;
    year: number;
  };
  description?: string;
}