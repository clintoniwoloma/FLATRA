import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSupabaseAuth } from '@/_core/hooks/useSupabaseAuth';
import { useIsMobile } from '@/hooks/useMobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DESKTOP_SIDEBAR_ITEMS, MOBILE_BOTTOM_NAV_ITEMS, MOBILE_FAB_ACTIONS } from '@/config/navigation';
import { ChevronDown, LogOut, Plus, Menu, X } from 'lucide-react';
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user, logout } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => setLocation('/login')}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileLayout user={user} logout={logout}>{children}</MobileLayout>;
  }

  return <DesktopLayout user={user} logout={logout}>{children}</DesktopLayout>;
}

function DesktopLayout({
  children,
  user,
  logout,
}: {
  children: React.ReactNode;
  user: any;
  logout: () => void;
}) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-background/95 backdrop-blur-sm flex flex-col">
        {/* Logo */}
        <div className="border-b border-border/40 px-6 py-6 flex items-center gap-3">
          <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-bold">FLATRA</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {DESKTOP_SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-border/40 px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 h-auto py-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.full_name || 'user'}`} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setLocation('/profile')}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function MobileLayout({
  children,
  user,
  logout,
}: {
  children: React.ReactNode;
  user: any;
  logout: () => void;
}) {
  const [, setLocation] = useLocation();
  const [showFAB, setShowFAB] = useState(false);
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold">FLATRA</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.full_name || 'user'}`} />
                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocation('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24">
        <div className="p-4">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around px-2 py-3">
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* FAB Menu */}
      <div className="fixed bottom-24 right-4 z-30">
        {showFAB && (
          <div className="absolute bottom-0 right-0 flex flex-col gap-2 mb-4">
            {MOBILE_FAB_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.action}
                  onClick={() => {
                    setLocation(action.path);
                    setShowFAB(false);
                  }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium"
                >
                  <Icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={() => setShowFAB(!showFAB)}
          className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {showFAB ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
