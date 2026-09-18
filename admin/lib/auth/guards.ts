import { createClient } from "../../utils/supabase/server";
import { KicksRole, isStaffRole } from "./roles";
import { KicksPermission, hasPermission } from "./permissions";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * Resolves the authenticated user's real role from the database.
 * DO NOT TRUST browser storage or user metadata for authorization.
 */
export async function getCurrentRole(userId: string): Promise<KicksRole> {
  const supabase = await createClient();
  
  // Safely fetch user_roles record. maybeSingle avoids throwing errors on no-rows-found.
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    // Default to customer role if fetch fails to enforce secure fail-closed.
    return 'customer';
  }

  return data.role as KicksRole;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Server-side guard to ensure the user is an authorized staff member.
 * Redirects to /unauthorized if they lack staff privileges.
 */
export async function requireStaffRole() {
  const user = await requireUser();
  const role = await getCurrentRole(user.id);

  if (!isStaffRole(role)) {
    redirect('/unauthorized');
  }

  return { user, role };
}

/**
 * Server-side guard for specific granular actions.
 * Throws an error instead of redirecting so it can be handled safely in Server Actions.
 */
export async function requirePermission(permission: KicksPermission) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const role = await getCurrentRole(user.id);
  
  if (!hasPermission(role, permission)) {
    redirect('/unauthorized');
  }

  return { user, role };
}
