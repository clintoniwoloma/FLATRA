import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import { Send, ArrowDownLeft, ArrowUpRight, Plus, TrendingUp, Wallet } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.fullName || "User"}!</h1>
          <p className="text-muted-foreground mt-2">Here's your financial overview</p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Balance</p>
              <h2 className="text-4xl font-bold">$12,450.50</h2>
              <p className="text-success text-sm mt-2">+2.5% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/20">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLocation("/wallet/send")}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLocation("/wallet/receive")}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Receive</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLocation("/escrow/create")}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Escrow</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLocation("/merchant/pay")}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span className="hidden sm:inline">Pay</span>
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Active Escrows</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground mt-2">Total value: $8,500</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold">$3,240</p>
                <p className="text-xs text-muted-foreground mt-2">12 transactions</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Pending</p>
                <p className="text-2xl font-bold">$1,250</p>
                <p className="text-xs text-muted-foreground mt-2">2 transactions</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <ArrowDownLeft className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/transactions")}>
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { type: "Escrow Release", amount: "+$500", time: "2 hours ago", status: "completed" },
              { type: "Payment to John", amount: "-$250", time: "1 day ago", status: "completed" },
              { type: "Escrow Funding", amount: "-$2,000", time: "3 days ago", status: "completed" },
              { type: "Wallet Deposit", amount: "+$1,500", time: "5 days ago", status: "completed" },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
                <p className={`font-semibold ${tx.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Crypto Ticker */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Crypto Market</h3>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/crypto")}>
              View More
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { symbol: "BTC", name: "Bitcoin", price: "$42,350", change: "+2.5%", icon: "₿" },
              { symbol: "ETH", name: "Ethereum", price: "$2,245", change: "+1.8%", icon: "Ξ" },
              { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "0%", icon: "$" },
            ].map((crypto, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {crypto.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{crypto.symbol}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold">{crypto.price}</p>
                  <p className={`text-xs font-semibold ${crypto.change.startsWith("+") ? "text-success" : "text-muted-foreground"}`}>
                    {crypto.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
