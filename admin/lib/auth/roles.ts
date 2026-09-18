export type KicksRole =
  | "customer"
  | "owner"
  | "admin"
  | "inventory_manager"
  | "order_manager"
  | "support";

export const ADMIN_ROLES: KicksRole[] = [
  "owner",
  "admin",
  "inventory_manager",
  "order_manager",
  "support",
];

export function isStaffRole(role: string): role is KicksRole {
  return ADMIN_ROLES.includes(role as KicksRole);
}
