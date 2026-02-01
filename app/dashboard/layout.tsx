import type { ReactNode } from 'react';

import DashboardLayoutClient from './dashboard-layout-client';

import { requireDashboardAuth } from '@/lib/server/dashboard-auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    await requireDashboardAuth();
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
