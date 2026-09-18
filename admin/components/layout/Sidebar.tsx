'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Box, 
  Users, 
  Tag, 
  Layers, 
  Ticket, 
  Star, 
  Bell,
  Shield,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';
import { logout } from '../../app/login/actions';
import { KicksRole } from '../../lib/auth/roles';
import { canAccessRoute } from '../../lib/auth/permissions';

const PRIMARY_LINKS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Brands', href: '/brands', icon: Tag },
  { name: 'Categories', href: '/categories', icon: Layers },
  { name: 'Promotions', href: '/promotions', icon: Ticket },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

const SECONDARY_LINKS = [
  { name: 'Staff & Roles', href: '/staff', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: KicksRole;
}

export function Sidebar({ isOpen = false, onClose, userRole = 'admin' }: SidebarProps) {
  const pathname = usePathname();

  const allowedPrimaryLinks = PRIMARY_LINKS.filter(link => canAccessRoute(userRole, link.href === '/' ? '/dashboard' : link.href));
  const allowedSecondaryLinks = SECONDARY_LINKS.filter(link => canAccessRoute(userRole, link.href));

  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] bg-card flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-8">
          <Link href="/" className="font-extrabold text-xl tracking-tighter text-foreground flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-black">K</span>
            </div>
            KICKS<span className="text-brand-primary">.</span>
          </Link>
          
          <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-0.5 no-scrollbar">
          <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-4 mb-3 px-4">
            Menu
          </div>
          <div className="space-y-1">
            {allowedPrimaryLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group",
                    isActive 
                      ? "text-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={18} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={cn(
                        "transition-colors", 
                        isActive ? "text-brand-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} 
                    />
                    {link.name}
                  </div>
                  
                  {/* Fake badge on Tasks/Orders to match Donezo design */}
                  {link.name === 'Orders' && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                      isActive ? "bg-brand-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                    )}>
                      12+
                    </span>
                  )}

                  {/* Active Indicator Pill on the left edge */}
                  {isActive && (
                    <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-8 mb-3 px-4">
            General
          </div>
          <div className="space-y-1">
            {allowedSecondaryLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group",
                    isActive 
                      ? "text-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon 
                    size={18} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={cn(
                      "transition-colors", 
                      isActive ? "text-brand-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                  {link.name}
                  {isActive && (
                    <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Logout link */}
            <form action={logout}>
              <button type="submit" className="relative flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[13px] font-medium text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all duration-200 group">
                <LogOut size={18} strokeWidth={2} className="text-muted-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
