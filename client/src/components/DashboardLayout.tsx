import { useEffect, useState } from 'react';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { DESKTOP_SIDEBAR_ITEMS, MOBILE_BOTTOM_NAV_ITEMS, MOBILE_FAB_ACTIONS } from '@/config/navigation';
import { ChevronDown, LogOut, Plus } from 'lucide-react';
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
    <SidebarProvider>
      <Sidebar className="border-r border-border/40">
        <SidebarHeader className="border-b border-border/40 px-4 py-6">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold">FLATRA</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {DESKTOP_SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setLocation(item.path)}
                    className="cursor-pointer"
                  >
                    <a href={item.path} className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.full_name || 'user'}`} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4" />
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
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
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
        <div className="flex items-center justify-around h-20">
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-muted/50 transition-colors"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* FAB Button */}
          <button
            onClick={() => setShowFAB(!showFAB)}
            className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* FAB Menu */}
        {showFAB && (
          <div className="absolute bottom-24 right-6 bg-card border border-border/40 rounded-2xl shadow-lg p-2 space-y-2 w-48">
            {MOBILE_FAB_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.action}
                  onClick={() => {
                    setLocation(action.path);
                    setShowFAB(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
