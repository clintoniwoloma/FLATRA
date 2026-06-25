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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("No user returned from signup");
    }

    // Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      fullName,
      role: "user",
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      throw profileError;
    }

    // Create wallet record with initial balance
    const { error: walletError } = await supabase.from("wallets").insert({
      userId: authData.user.id,
      balance: 0,
      currency: "USD",
      type: "fiat",
    });

    if (walletError) {
      console.error("Error creating wallet:", walletError);
      throw walletError;
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
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
      throw error;
    }

    return { session: data.session, user: data.user, error: null };
  } catch (error) {
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
