import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, Shield, Zap, TrendingUp, ShoppingCart, Coins } from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const features = [
    {
      icon: Shield,
      title: "Escrow Transactions",
      description: "Secure, transparent transactions with buyer and seller protection. Hold funds safely until both parties are satisfied.",
    },
    {
      icon: Zap,
      title: "Instant Wallet",
      description: "Send and receive money instantly. Manage multiple currencies and wallets in one place.",
    },
    {
      icon: TrendingUp,
      title: "Merchant Payments",
      description: "Accept payments from customers worldwide. Integrated payment links and merchant dashboard.",
    },
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Buy and sell products securely. Built-in dispute resolution and transaction protection.",
    },
    {
      icon: Coins,
      title: "Crypto Utility",
      description: "Real-time crypto prices and market data. Seamless integration with blockchain assets.",
    },
    {
      icon: TrendingUp,
      title: "Financial Inclusion",
      description: "Access banking services without traditional barriers. Global, accessible fintech for everyone.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold">FLATRA</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href={getLoginUrl()}>Login</a>
            </Button>
            <Button asChild>
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              The Premium Fintech
              <span className="block bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                Super App
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Escrow transactions, instant payments, merchant tools, and crypto utility. All in one elegant platform built for the modern financial world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="group">
                <a href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 border-t border-border/40">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              FLATRA combines the best features of leading fintech platforms into one premium experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border border-border/40 hover:border-primary/40 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border/40">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8 p-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who trust FLATRA for secure, transparent, and instant financial transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/signup">Create Account</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={getLoginUrl()}>Login</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-card/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/manus-storage/flatra-logo_6131fa86.png" alt="FLATRA" className="w-8 h-8 rounded-lg" />
              <span className="font-semibold">FLATRA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 FLATRA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
