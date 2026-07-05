import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceFormatted: string;
  change24h: number;
  change24hFormatted: string;
  change24hColor: string;
  image: string;
  marketCap?: number;
  marketCapFormatted?: string;
  volume24h?: number;
}

export function CryptoTicker() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: marketData, isLoading: isFetching } = trpc.crypto.getMarketOverview.useQuery();

  useEffect(() => {
    if (marketData?.data?.topCryptos) {
      const cryptoData = marketData.data.topCryptos.map((crypto: any) => ({
        ...crypto,
        change24hColor: crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500',
      }));
      setCryptos(cryptoData);
      setIsLoading(false);
    }
  }, [marketData]);

  if (isLoading || isFetching) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Market Overview</h3>
        {marketData?.data && (
          <div className="text-sm text-muted-foreground">
            <p>Market Cap: {marketData.data.totalMarketCapFormatted}</p>
            <p>24h Volume: {marketData.data.totalVolumeFormatted}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              {crypto.image && (
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-semibold text-sm">{crypto.symbol}</span>
            </div>

            <p className="text-lg font-bold mb-1">{crypto.priceFormatted}</p>

            <div className={`flex items-center gap-1 text-sm font-medium ${crypto.change24hColor}`}>
              {crypto.change24h >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{crypto.change24hFormatted}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
