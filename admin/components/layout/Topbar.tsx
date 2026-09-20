'use client';

import { Search, Bell, ChevronDown, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TopbarProps {
  onMenuClick?: () => void;
  userName?: string;
  userInitials?: string;
  roleName?: string;
}

export function Topbar({ 
  onMenuClick, 
  userName = "Admin User", 
  userInitials = "AU", 
  roleName = "Admin" 
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-20 bg-card flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0 transition-colors">
      <div className="flex-1 flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors flex items-center justify-center"
        >
          <i className="fi fi-sr-bars-staggered text-xl leading-none"></i>
        </button>
        
        {/* Search */}
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2.5 border-transparent rounded-full text-sm bg-muted/60 placeholder-muted-foreground focus:outline-none focus:bg-muted focus:ring-1 focus:ring-brand-primary transition-colors"
            placeholder="Search tasks, orders..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-semibold text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">⌘F</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-border hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
          )}

          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border hover:bg-muted text-muted-foreground transition-colors relative">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-card" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer pl-1 md:pl-2">
          <div className="hidden lg:flex flex-col items-end">
            <p className="text-sm font-semibold text-foreground leading-tight">{userName}</p>
            <p className="text-[11px] text-muted-foreground">{roleName}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm overflow-hidden border border-border/50 uppercase">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
