import { ReactNode } from 'react';
import { DashboardShell } from './DashboardShell';
import { requireStaffRole } from '../../lib/auth/guards';
import { createClient } from '../../utils/supabase/server';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, user } = await requireStaffRole();
  const supabase = await createClient();

  // Fetch user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const firstName = profile?.first_name || 'Admin';
  const lastName = profile?.last_name || 'User';
  const userName = `${firstName} ${lastName.charAt(0)}.`;
  const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Format role name (e.g. "inventory_manager" -> "Inventory Manager")
  const roleName = role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch pending orders count
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'processing']);

  const pendingOrdersCount = count || 0;

  return (
    <DashboardShell 
      userRole={role}
      userName={userName}
      userInitials={userInitials}
      roleName={roleName}
      pendingOrdersCount={pendingOrdersCount}
    >
      {children}
    </DashboardShell>
  );
}
