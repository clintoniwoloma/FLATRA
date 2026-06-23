import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon: string;
}

export default function Crypto() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  useEffect(() => {
    // Mock crypto data - in production, this would fetch from CoinGecko MCP
    const mockData: CryptoData[] = [
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        price: 42350,
        change24h: 2.5,
        marketCap: 830000000000,
        volume24h: 28000000000,
        icon: "₿",
      },
      {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        price: 2245,
        change24h: 1.8,
        marketCap: 270000000000,
        volume24h: 12000000000,
        icon: "Ξ",
      },
      {
        id: "cardano",
        symbol: "ADA",
        name: "Cardano",
        price: 0.95,
        change24h: -0.5,
        marketCap: 33000000000,
        volume24h: 450000000,
        icon: "₳",
      },
      {
        id: "solana",
        symbol: "SOL",
        name: "Solana",
        price: 142,
        change24h: 3.2,
        marketCap: 62000000000,
        volume24h: 2500000000,
        icon: "◎",
      },
      {
        id: "polkadot",
        symbol: "DOT",
        name: "Polkadot",
        price: 8.45,
        change24h: 1.2,
        marketCap: 12000000000,
        volume24h: 380000000,
        icon: "●",
      },
      {
        id: "usdcoin",
        symbol: "USDC",
        name: "USD Coin",
        price: 1.0,
        change24h: 0,
        marketCap: 35000000000,
        volume24h: 5000000000,
        icon: "$",
      },
    ];

    setCryptoData(mockData);
    setIsLoading(false);
  }, []);

  const filteredCrypto = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1000000000) {
      return `$${(cap / 1000000000).toFixed(1)}B`;
    }
    return `$${(cap / 1000000).toFixed(1)}M`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Crypto Market</h1>
          <p className="text-muted-foreground mt-2">Real-time cryptocurrency prices and market data</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Market Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Market Cap</p>
            <p className="text-2xl font-bold">$2.1T</p>
            <p className="text-xs text-success mt-2">+1.2% (24h)</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">24h Volume</p>
            <p className="text-2xl font-bold">$85B</p>
            <p className="text-xs text-muted-foreground mt-2">Global volume</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">BTC Dominance</p>
            <p className="text-2xl font-bold">39.5%</p>
            <p className="text-xs text-foreground mt-2">Market share</p>
          </Card>
        </div>

        {/* Crypto List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : filteredCrypto.length > 0 ? (
          <div className="space-y-4">
            {filteredCrypto.map((crypto) => (
              <Card
                key={crypto.id}
                className="p-6 hover:border-primary/40 cursor-pointer transition-colors"
                onClick={() => setLocation(`/crypto/${crypto.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                      {crypto.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{crypto.name}</p>
                        <Badge variant="secondary">{crypto.symbol}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Market Cap: {formatMarketCap(crypto.marketCap)} • Volume: {formatMarketCap(crypto.volume24h)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">{formatPrice(crypto.price)}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {crypto.change24h >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-success" />
                          <p className="text-sm font-semibold text-success">+{crypto.change24h.toFixed(2)}%</p>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-destructive" />
                          <p className="text-sm font-semibold text-destructive">{crypto.change24h.toFixed(2)}%</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No cryptocurrencies found</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </Card>
        )}

        {/* Info Box */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <p className="text-sm">
            <span className="font-semibold">Note:</span> Prices are updated every 60 seconds. Data is provided by CoinGecko and is for informational purposes only.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
