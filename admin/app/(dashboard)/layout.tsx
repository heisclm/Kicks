import { ReactNode } from 'react';
import { DashboardShell } from './DashboardShell';
import { requireStaffRole } from '../../lib/auth/guards';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { role } = await requireStaffRole();
  return <DashboardShell userRole={role}>{children}</DashboardShell>;
}
