import { ProjectData } from '@/lib/types';

export const ENTRESTATE_INVENTORY: ProjectData[] = [
  {
    id: 'p1',
    name: 'Dubai Hills Estate',
    developer: 'Emaar',
    status: 'Available',
    price: { label: 'AED 3,500,000', value: 3500000 },
    location: { city: 'Dubai', area: 'Dubai Hills' },
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop'],
    performance: { roi: 6.5, capitalAppreciation: 12 },
    handover: { quarter: 4, year: 2025 },
    description: { short: 'Luxury villas surrounding an 18-hole championship golf course.', full: 'Luxury villas surrounding an 18-hole championship golf course.' }
  },
  {
    id: 'p2',
    name: 'Palm Jumeirah Signature',
    developer: 'Nakheel',
    status: 'Limited',
    price: { label: 'AED 15,000,000', value: 15000000 },
    location: { city: 'Dubai', area: 'Palm Jumeirah' },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'],
    performance: { roi: 5.2, capitalAppreciation: 8 },
    handover: { quarter: 2, year: 2024 },
    description: { short: 'Exclusive beachfront living on the world-famous archipelago.', full: 'Exclusive beachfront living on the world-famous archipelago.' }
  },
  {
    id: 'p3',
    name: 'Downtown Views II',
    developer: 'Emaar',
    status: 'Selling Fast',
    price: { label: 'AED 1,800,000', value: 1800000 },
    location: { city: 'Dubai', area: 'Downtown Dubai' },
    images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1600&auto=format&fit=crop'],
    performance: { roi: 7.1, capitalAppreciation: 5 },
    handover: { quarter: 1, year: 2026 },
    description: { short: 'High-rise apartments with direct access to Dubai Mall.', full: 'High-rise apartments with direct access to Dubai Mall.' }
  }
];