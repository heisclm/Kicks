export type AppRole = 'customer' | 'support' | 'inventory_manager' | 'order_manager' | 'admin' | 'owner';

export interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: AppRole;
}
