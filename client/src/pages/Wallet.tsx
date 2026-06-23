import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowDownLeft, Plus, Wallet as WalletIcon } from "lucide-react";

interface WalletBalance {
  id: string;
  currency: string;
  balance: number;
  type: "fiat" | "crypto";
  icon: string;
}

export default function Wallet() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("fiat");

  // Mock wallet data
  const wallets: WalletBalance[] = [
    { id: "w1", currency: "USD", balance: 5250.50, type: "fiat", icon: "$" },
    { id: "w2", currency: "EUR", balance: 2100.00, type: "fiat", icon: "€" },
    { id: "w3", currency: "GBP", balance: 1500.75, type: "fiat", icon: "£" },
    { id: "w4", currency: "BTC", balance: 0.5, type: "crypto", icon: "₿" },
    { id: "w5", currency: "ETH", balance: 5.25, type: "crypto", icon: "Ξ" },
    { id: "w6", currency: "USDC", balance: 10000, type: "crypto", icon: "$" },
  ];

  const fiatWallets = wallets.filter((w) => w.type === "fiat");
  const cryptoWallets = wallets.filter((w) => w.type === "crypto");

  const fiatTotal = fiatWallets.reduce((sum, w) => sum + w.balance, 0);
  const cryptoTotal = cryptoWallets.reduce((sum, w) => sum + w.balance, 0);

  const renderWalletCard = (wallet: WalletBalance) => (
    <Card key={wallet.id} className="p-6 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
            {wallet.icon}
          </div>
          <div>
            <p className="font-semibold">{wallet.currency}</p>
            <p className="text-xs text-muted-foreground">
              {wallet.type === "fiat" ? "Fiat Currency" : "Cryptocurrency"}
            </p>
          </div>
        </div>
        <Badge variant="outline">{wallet.type}</Badge>
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground text-sm mb-1">Balance</p>
        <p className="text-2xl font-bold">
          {wallet.type === "crypto" ? wallet.balance.toFixed(4) : wallet.balance.toFixed(2)}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={() => setLocation("/wallet/send")}>
          <Send className="w-4 h-4" />
          Send
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={() => setLocation("/wallet/receive")}>
          <ArrowDownLeft className="w-4 h-4" />
          Receive
        </Button>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallets</h1>
            <p className="text-muted-foreground mt-2">Manage your fiat and crypto wallets</p>
          </div>
          <Button onClick={() => setLocation("/wallet/add")} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Wallet
          </Button>
        </div>

        {/* Total Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Fiat Balance</p>
                <h2 className="text-3xl font-bold">USD ${fiatTotal.toFixed(2)}</h2>
              </div>
              <div className="p-3 rounded-lg bg-primary/20">
                <WalletIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{fiatWallets.length} currencies</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-secondary/10 to-success/10 border-secondary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Crypto Balance</p>
                <h2 className="text-3xl font-bold">≈ ${(cryptoTotal * 2245).toFixed(2)}</h2>
              </div>
              <div className="p-3 rounded-lg bg-secondary/20">
                <WalletIcon className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{cryptoWallets.length} assets</p>
          </Card>
        </div>

        {/* Wallets Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fiat">Fiat Wallets ({fiatWallets.length})</TabsTrigger>
            <TabsTrigger value="crypto">Crypto Wallets ({cryptoWallets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="fiat" className="space-y-4 mt-6">
            {fiatWallets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fiatWallets.map(renderWalletCard)}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No fiat wallets yet</p>
                <Button onClick={() => setLocation("/wallet/add")}>Create Fiat Wallet</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-6">
            {cryptoWallets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cryptoWallets.map(renderWalletCard)}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No crypto wallets yet</p>
                <Button onClick={() => setLocation("/wallet/add")}>Add Crypto Wallet</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/transactions")}>
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { type: "Received", amount: "+$500", wallet: "USD", time: "2 hours ago" },
              { type: "Sent", amount: "-$250", wallet: "USD", time: "1 day ago" },
              { type: "Received", amount: "+0.5 BTC", wallet: "BTC", time: "3 days ago" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    {activity.type === "Received" ? (
                      <ArrowDownLeft className="w-4 h-4 text-success" />
                    ) : (
                      <Send className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.type} to {activity.wallet}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <p className={`font-semibold ${activity.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
                  {activity.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
