import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Configuration", () => {
  it("should have valid Supabase credentials configured", () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/);
    expect(supabaseAnonKey.length).toBeGreaterThan(0);
  });

  it("should be able to create a Supabase client", () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const client = createClient(supabaseUrl, supabaseAnonKey);
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
