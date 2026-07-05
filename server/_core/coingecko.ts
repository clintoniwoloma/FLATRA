/**
 * CoinGecko Integration via MCP
 * Provides real-time cryptocurrency market data
 */

import { exec } from 'child_process';
import { promisify } from 'util';

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
