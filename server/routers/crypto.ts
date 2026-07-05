/**
 * Cryptocurrency Router
 * Provides tRPC procedures for crypto market data
 */

import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getTopCryptos, getCryptoPrice, formatPrice, formatChange, getChangeColor } from '../_core/coingecko';

export const cryptoRouter = router({
  /**
   * Get top cryptocurrencies by market cap
   */
  getTopCryptos: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(250).default(10) }).optional())
    .query(async ({ input }) => {
      try {
        const cryptos = await getTopCryptos(input?.limit || 10);
        return {
          success: true,
          data: cryptos.map((crypto) => ({
            ...crypto,
            priceFormatted: formatPrice(crypto.price),
            change24hFormatted: formatChange(crypto.change24h),
            change24hColor: getChangeColor(crypto.change24h),
            change7dFormatted: formatChange(crypto.change7d),
            change7dColor: getChangeColor(crypto.change7d),
          })),
        };
      } catch (error) {
        console.error('Error fetching top cryptos:', error);
        return {
          success: false,
          error: 'Failed to fetch cryptocurrency data',
          data: [],
        };
      }
    }),

  /**
   * Get price of a specific cryptocurrency
   */
  getCryptoPrice: publicProcedure
    .input(z.object({ cryptoId: z.string() }))
    .query(async ({ input }) => {
      try {
        const crypto = await getCryptoPrice(input.cryptoId);
        if (!crypto) {
          return {
            success: false,
            error: `Cryptocurrency ${input.cryptoId} not found`,
            data: null,
          };
        }

        return {
          success: true,
          data: {
            ...crypto,
            priceFormatted: formatPrice(crypto.price),
            change24hFormatted: formatChange(crypto.change24h),
            change24hColor: getChangeColor(crypto.change24h),
            change7dFormatted: formatChange(crypto.change7d),
            change7dColor: getChangeColor(crypto.change7d),
            change30dFormatted: formatChange(crypto.change30d),
            change30dColor: getChangeColor(crypto.change30d),
          },
        };
      } catch (error) {
        console.error('Error fetching crypto price:', error);
        return {
          success: false,
          error: 'Failed to fetch cryptocurrency price',
          data: null,
        };
      }
    }),

  /**
   * Get multiple cryptocurrency prices
   */
  getMultiplePrices: publicProcedure
    .input(z.object({ cryptoIds: z.array(z.string()).min(1).max(50) }))
    .query(async ({ input }) => {
      try {
        const prices = await Promise.all(
          input.cryptoIds.map((id) => getCryptoPrice(id))
        );

        const validPrices = prices.filter((p) => p !== null).map((crypto) => ({
          ...crypto,
          priceFormatted: formatPrice(crypto!.price),
          change24hFormatted: formatChange(crypto!.change24h),
          change24hColor: getChangeColor(crypto!.change24h),
        }));

        return {
          success: true,
          data: validPrices,
        };
      } catch (error) {
        console.error('Error fetching multiple prices:', error);
        return {
          success: false,
          error: 'Failed to fetch cryptocurrency prices',
          data: [],
        };
      }
    }),

  /**
   * Get market overview (top 5 cryptos)
   */
  getMarketOverview: publicProcedure.query(async () => {
    try {
      const cryptos = await getTopCryptos(5);
      const totalMarketCap = cryptos.reduce((sum, c) => sum + c.marketCap, 0);
      const totalVolume = cryptos.reduce((sum, c) => sum + c.volume24h, 0);

      return {
        success: true,
        data: {
          topCryptos: cryptos.map((crypto) => ({
            ...crypto,
            priceFormatted: formatPrice(crypto.price),
            change24hFormatted: formatChange(crypto.change24h),
            marketCapFormatted: formatPrice(crypto.marketCap),
          })),
          totalMarketCap,
          totalMarketCapFormatted: formatPrice(totalMarketCap),
          totalVolume,
          totalVolumeFormatted: formatPrice(totalVolume),
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return {
        success: false,
        error: 'Failed to fetch market overview',
        data: null,
      };
    }
  }),
});
