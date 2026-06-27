import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { signUpWithEmail } from "@/lib/supabase";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Signup() {
  const { isAuthenticated, loading: authLoading } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const { user, error: signupError, requiresEmailConfirmation } = await signUpWithEmail(email, password, fullName);

      if (signupError) {
        const errorMsg = signupError instanceof Error ? signupError.message : "Signup failed";
        console.error("Signup error:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (user) {
        setSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setAgreeToTerms(false);
        
        // Redirect after short delay
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
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
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join FLATRA today</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
              Account created successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || success}
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
                disabled={isLoading || success}
              />
              <p className="text-xs text-muted-foreground">At least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || success}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                disabled={isLoading || success}
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                I agree to the{" "}
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  Terms and Conditions
                </Button>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || success}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : success ? "Account created!" : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm mt-6 pt-6 border-t border-border/40">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button
              variant="link"
              onClick={() => setLocation("/login")}
              className="text-primary hover:text-primary/80"
            >
              Sign in
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
