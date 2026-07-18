/**
 * CoinGecko Integration via MCP
 * Provides real-time cryptocurrency market data
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { getCryptoCache, getCryptoCacheById, upsertCryptoCacheRows } from '../db';

const execAsync = promisify(exec);

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  ath: number;
  atl: number;
  image: string;
}

interface MarketData {
  cryptos: CryptoPrice[];
  timestamp: Date;
}

/**
 * Get top cryptocurrencies by market cap using CoinGecko MCP
 */
export async function getTopCryptos(limit: number = 10): Promise<CryptoPrice[]> {
  try {
    // Try DB cache first
    const cached = await getCryptoCache(limit);
    if (cached && cached.length > 0) {
      // If cache is fresh (updated within 60 seconds), return it
      const newest = new Date(cached[0].updated_at).getTime();
      if (Date.now() - newest < 60 * 1000) {
        return cached.map((c) => ({
          id: c.id,
          symbol: (c.data?.symbol || "").toUpperCase(),
          name: c.data?.name || c.id,
          price: Number(c.price),
          marketCap: Number(c.market_cap),
          volume24h: Number(c.volume24h),
          change24h: Number(c.change24h),
          change7d: c.change7d != null ? Number(c.change7d) : 0,
          change30d: c.change30d != null ? Number(c.change30d) : 0,
          ath: c.data?.ath || 0,
          atl: c.data?.atl || 0,
          image: c.image || (c.data?.image || ''),
        }));
      }
    }

    const query = `
      query {
        coins(order: market_cap_desc, per_page: ${limit}, page: 1, sparkline: true) {
          id
          symbol
          name
          market_data {
            current_price {
              usd
            }
            market_cap {
              usd
            }
            total_volume {
              usd
            }
            price_change_percentage_24h
            price_change_percentage_7d
            price_change_percentage_30d
            ath {
              usd
            }
            atl {
              usd
            }
          }
          image {
            large
          }
        }
      }
    `;

    // Call CoinGecko MCP via CLI
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call search_docs --server coingecko --input '{"query": "${query.replace(/"/g, '\\"')}"}'`,
      { maxBuffer: 10 * 1024 * 1024 }
    );

    const result = JSON.parse(stdout);
    
    // Parse and transform the response
    const cryptos: CryptoPrice[] = result.coins?.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.market_data?.current_price?.usd || 0,
      marketCap: coin.market_data?.market_cap?.usd || 0,
      volume24h: coin.market_data?.total_volume?.usd || 0,
      change24h: coin.market_data?.price_change_percentage_24h || 0,
      change7d: coin.market_data?.price_change_percentage_7d || 0,
      change30d: coin.market_data?.price_change_percentage_30d || 0,
      ath: coin.market_data?.ath?.usd || 0,
      atl: coin.market_data?.atl?.usd || 0,
      image: coin.image?.large || '',
    })) || [];

    // Persist to DB cache (best-effort)
    try {
      await upsertCryptoCacheRows(
        cryptos.map((c) => ({
          id: c.id,
          data: c,
          price: c.price,
          marketCap: c.marketCap,
          volume24h: c.volume24h,
          change24h: c.change24h,
          change7d: c.change7d,
          change30d: c.change30d,
          image: c.image,
        }))
      );
    } catch (e) {
      console.warn('[Coingecko] Failed to persist crypto cache:', e);
    }

    return cryptos;
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    // Return mock data as fallback
    return getMockCryptoData();
  }
}

/**
 * Get price of a specific cryptocurrency
 */
export async function getCryptoPrice(cryptoId: string): Promise<CryptoPrice | null> {
  try {
    // Try DB cache first
    const cached = await getCryptoCacheById(cryptoId);
    if (cached) {
      const updated = new Date(cached.updated_at).getTime();
      if (Date.now() - updated < 60 * 1000) {
        return {
          id: cached.id,
          symbol: (cached.data?.symbol || "").toUpperCase(),
          name: cached.data?.name || cached.id,
          price: Number(cached.price),
          marketCap: Number(cached.market_cap),
          volume24h: Number(cached.volume24h),
          change24h: Number(cached.change24h),
          change7d: cached.change7d != null ? Number(cached.change7d) : 0,
          change30d: cached.change30d != null ? Number(cached.change30d) : 0,
          ath: cached.data?.ath || 0,
          atl: cached.data?.atl || 0,
          image: cached.image || (cached.data?.image || ''),
        };
      }
    }

    const query = `
      query {
        coin(id: "${cryptoId}") {
          id
          symbol
          name
          market_data {
            current_price { usd }
            market_cap { usd }
            total_volume { usd }
            price_change_percentage_24h
            price_change_percentage_7d
            price_change_percentage_30d
            ath { usd }
            atl { usd }
          }
          image { large }
        }
      }
    `;

    const { stdout } = await execAsync(
      `manus-mcp-cli tool call search_docs --server coingecko --input '{"query": "${query.replace(/"/g, '\\"')}"}'`,
      { maxBuffer: 10 * 1024 * 1024 }
    );

    const result = JSON.parse(stdout);
    const coin = result.coin;

    if (!coin) return null;

    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.market_data?.current_price?.usd || 0,
      marketCap: coin.market_data?.market_cap?.usd || 0,
      volume24h: coin.market_data?.total_volume?.usd || 0,
      change24h: coin.market_data?.price_change_percentage_24h || 0,
      change7d: coin.market_data?.price_change_percentage_7d || 0,
      change30d: coin.market_data?.price_change_percentage_30d || 0,
      ath: coin.market_data?.ath?.usd || 0,
      atl: coin.market_data?.atl?.usd || 0,
      image: coin.image?.large || '',
    };
  } catch (error) {
    console.error(`Error fetching price for ${cryptoId}:`, error);
    return null;
  }
}

/**
 * Mock cryptocurrency data for fallback/demo purposes
 */
function getMockCryptoData(): CryptoPrice[] {
  return [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67500,
      marketCap: 1320000000000,
      volume24h: 28000000000,
      change24h: 2.5,
      change7d: 5.2,
      change30d: 12.3,
      ath: 69000,
      atl: 15000,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3500,
      marketCap: 420000000000,
      volume24h: 15000000000,
      change24h: 1.8,
      change7d: 3.5,
      change30d: 8.9,
      ath: 4800,
      atl: 500,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 1.05,
      marketCap: 38000000000,
      volume24h: 800000000,
      change24h: 1.2,
      change7d: 2.1,
      change30d: 5.6,
      ath: 3.1,
      atl: 0.02,
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 185,
      marketCap: 82000000000,
      volume24h: 3500000000,
      change24h: 2.1,
      change7d: 4.3,
      change30d: 15.2,
      ath: 260,
      atl: 1.5,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      price: 2.45,
      marketCap: 135000000000,
      volume24h: 2200000000,
      change24h: 1.5,
      change7d: 3.2,
      change30d: 9.8,
      ath: 3.84,
      atl: 0.002,
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png',
    },
  ];
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return price.toFixed(8);
}

/**
 * Format percentage change
 */
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Get color for percentage change
 */
export function getChangeColor(change: number): string {
  if (change >= 0) return 'text-green-500';
  return 'text-red-500';
}
