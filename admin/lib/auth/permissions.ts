import { KicksRole } from "./roles";

export type KicksPermission =
  | "dashboard.view"
  | "products.view" | "products.create" | "products.update" | "products.delete"
  | "inventory.view" | "inventory.update"
  | "orders.view" | "orders.manage"
  | "customers.view" | "customers.manage"
  | "brands.view" | "brands.create" | "brands.update" | "brands.delete"
  | "categories.view" | "categories.create" | "categories.update" | "categories.delete"
  | "promotions.manage"
  | "reviews.manage"
  | "notifications.send"
  | "settings.manage"
  | "staff.manage";

const ROLE_PERMISSIONS: Record<KicksRole, Set<KicksPermission>> = {
  owner: new Set([
    "dashboard.view", 
    "products.view", "products.create", "products.update", "products.delete",
    "inventory.view", "inventory.update",
    "orders.view", "orders.manage", 
    "customers.view", "customers.manage",
    "brands.view", "brands.create", "brands.update", "brands.delete",
    "categories.view", "categories.create", "categories.update", "categories.delete",
    "promotions.manage", "reviews.manage", "notifications.send", "settings.manage", "staff.manage"
  ]),
  admin: new Set([
    "dashboard.view", 
    "products.view", "products.create", "products.update", "products.delete",
    "inventory.view", "inventory.update",
    "orders.view", "orders.manage", 
    "customers.view", "customers.manage",
    "brands.view", "brands.create", "brands.update", "brands.delete",
    "categories.view", "categories.create", "categories.update", "categories.delete",
    "promotions.manage", "reviews.manage", "notifications.send", "settings.manage"
  ]),
  inventory_manager: new Set([
    "dashboard.view", 
    "products.view", "products.create", "products.update", "products.delete",
    "inventory.view", "inventory.update",
    "brands.view", "brands.create", "brands.update", "brands.delete",
    "categories.view", "categories.create", "categories.update", "categories.delete"
  ]),
  order_manager: new Set([
    "dashboard.view", "orders.view", "orders.manage", "customers.view", "products.view", "inventory.view", "brands.view", "categories.view"
  ]),
  support: new Set([
    "dashboard.view", "orders.view", "customers.view", "customers.manage", "products.view", "reviews.manage", "notifications.send", "brands.view", "categories.view"
  ]),
  customer: new Set([]) 
};

export function hasPermission(role: KicksRole, permission: KicksPermission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function canAccessRoute(role: KicksRole, pathname: string): boolean {
  if (role === 'customer') return false;
  if (role === 'owner' || role === 'admin') return true;

  if (pathname.startsWith('/products')) return hasPermission(role, 'products.view');
  if (pathname.startsWith('/inventory')) return hasPermission(role, 'inventory.view');
  if (pathname.startsWith('/orders')) return hasPermission(role, 'orders.view');
  if (pathname.startsWith('/customers')) return hasPermission(role, 'customers.view');
  if (pathname.startsWith('/brands')) return hasPermission(role, 'brands.view');
  if (pathname.startsWith('/categories')) return hasPermission(role, 'categories.view');
  if (pathname.startsWith('/promotions')) return hasPermission(role, 'promotions.manage');
  if (pathname.startsWith('/reviews')) return hasPermission(role, 'reviews.manage');
  if (pathname.startsWith('/notifications')) return hasPermission(role, 'notifications.send');
  if (pathname.startsWith('/staff')) return hasPermission(role, 'staff.manage');
  if (pathname.startsWith('/settings')) return hasPermission(role, 'settings.manage');

  if (pathname === '/' || pathname === '/dashboard') return hasPermission(role, 'dashboard.view');

  return false;
}
