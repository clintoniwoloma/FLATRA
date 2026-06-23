import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const walletRouter = router({
  // Get wallet balance
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { fiat: 0, crypto: {} };

    try {
      // TODO: Implement real balance query from Supabase
      return {
        fiat: 5000,
        crypto: {
          BTC: 0.5,
          ETH: 2.5,
          USDC: 1000,
        },
      };
    } catch (error) {
      console.error("[Wallet] Failed to get balance:", error);
      throw error;
    }
  }),

  // Get wallet transactions
  getTransactions: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // TODO: Implement real transaction query
        return [];
      } catch (error) {
        console.error("[Wallet] Failed to get transactions:", error);
        throw error;
      }
    }),

  // Send funds
  sendFunds: protectedProcedure
    .input(
      z.object({
        recipientEmail: z.string().email(),
        amount: z.number().positive(),
        currency: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real send logic
        return { success: true, transactionId: "txn_new" };
      } catch (error) {
        console.error("[Wallet] Failed to send funds:", error);
        throw error;
      }
    }),

  // Request funds
  requestFunds: protectedProcedure
    .input(
      z.object({
        senderEmail: z.string().email(),
        amount: z.number().positive(),
        currency: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real request logic
        return { success: true };
      } catch (error) {
        console.error("[Wallet] Failed to request funds:", error);
        throw error;
      }
    }),
});
