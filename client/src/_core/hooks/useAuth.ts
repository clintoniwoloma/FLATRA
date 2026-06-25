/**
 * DEPRECATED: This hook is kept for backward compatibility only.
 * Use useSupabaseAuth from @/_core/hooks/useSupabaseAuth instead.
 * 
 * This old hook was tied to Manus OAuth and tRPC auth endpoints.
 * All new code should use useSupabaseAuth for Supabase-based authentication.
 */

import { useSupabaseAuth } from "./useSupabaseAuth";

export function useAuth() {
  // Redirect to new Supabase-based auth hook
  return useSupabaseAuth();
}
