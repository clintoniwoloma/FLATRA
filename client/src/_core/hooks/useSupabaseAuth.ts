import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUser, signOut as supabaseSignOut } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check current session on mount
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user,
          loading: false,
          error: null,
          isAuthenticated: !!user,
        });
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : "Auth check failed",
          isAuthenticated: false,
        });
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuthState({
          user: session.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    try {
      const { error } = await supabaseSignOut();
      if (error) throw error;
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      
      setLocation("/");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
    }
  };

  return {
    ...authState,
    logout,
  };
}
