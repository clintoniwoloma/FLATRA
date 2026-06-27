import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { signInWithEmail } from "@/lib/supabase";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading: authLoading } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email.trim()) {
        setError("Please enter your email");
        setIsLoading(false);
        return;
      }
      if (!password) {
        setError("Please enter your password");
        setIsLoading(false);
        return;
      }

      const { session, user, error: loginError } = await signInWithEmail(email, password);

      if (loginError) {
        const errorMsg = loginError instanceof Error ? loginError.message : "Login failed";
        console.error("Login error:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (user && session) {
        setLocation("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 py-4">
        <div className="container">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8 border-border/40">
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-12 h-12 rounded-lg mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your FLATRA account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Password Reset Link */}
          <div className="text-center text-sm">
            <Button
              variant="link"
              onClick={() => setLocation("/password-reset")}
              className="text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm mt-6 pt-6 border-t border-border/40">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              onClick={() => setLocation("/signup")}
              className="text-primary hover:text-primary/80"
            >
              Sign up
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
