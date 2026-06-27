import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get current session
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return data.session;
}

// Helper to get current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  return data.user;
}

// Helper to sign up with email/password
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    // Step 1: Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Signup auth error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("No user returned from signup");
    }

    console.log("User created:", authData.user.id);

    // Step 2: Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      fullName,
      role: "user",
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Don't throw - profile might exist or RLS might be blocking
    }

    // Step 3: Create wallet record with initial balance
    const { error: walletError } = await supabase.from("wallets").insert({
      userId: authData.user.id,
      balance: 0,
      currency: "USD",
      type: "fiat",
    });

    if (walletError) {
      console.error("Error creating wallet:", walletError);
      // Don't throw - wallet might exist or RLS might be blocking
    }

    // Step 4: Auto-login the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.warn("Auto-login after signup failed:", signInError);
      // This is expected if email confirmation is required
      // User will need to confirm email first
      return { 
        user: authData.user, 
        error: null,
        requiresEmailConfirmation: true 
      };
    }

    console.log("Auto-login successful");
    return { 
      user: signInData.user, 
      error: null,
      requiresEmailConfirmation: false 
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { 
      user: null, 
      error,
      requiresEmailConfirmation: false 
    };
  }
}

// Helper to sign in with email/password
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }

    return { session: data.session, user: data.user, error: null };
  } catch (error) {
    console.error("Sign in catch error:", error);
    return { session: null, user: null, error };
  }
}

// Helper to sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Helper to reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset-confirm`,
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Helper to update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session);
  });
}
