'use client';

import { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

import { KicksRole } from '../../lib/auth/roles';

interface DashboardShellProps {
  children: React.ReactNode;
  userRole: KicksRole;
  userName: string;
  userInitials: string;
  roleName: string;
  pendingOrdersCount: number;
}

export function DashboardShell({ 
  children, 
  userRole,
  userName,
  userInitials,
  roleName,
  pendingOrdersCount
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f0f4f8] dark:bg-[#0a0a0a] p-0 sm:p-2 lg:p-3 overflow-hidden">
      <div className="flex flex-1 overflow-hidden bg-card rounded-none sm:rounded-[2rem] sm:border border-border/40 shadow-sm relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          userRole={userRole} 
          pendingOrdersCount={pendingOrdersCount}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar 
            onMenuClick={() => setSidebarOpen(true)} 
            userName={userName}
            userInitials={userInitials}
            roleName={roleName}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:px-8 md:pb-8 pt-2 no-scrollbar">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
