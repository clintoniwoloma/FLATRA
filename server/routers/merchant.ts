import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const merchantRouter = router({
  // Get merchant profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    try {
      // TODO: Implement real merchant profile query
      return null;
    } catch (error) {
      console.error("[Merchant] Failed to get profile:", error);
      throw error;
    }
  }),

  // Update merchant profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        businessName: z.string().optional(),
        businessEmail: z.string().email().optional(),
        businessPhone: z.string().optional(),
        businessWebsite: z.string().url().optional(),
        businessDescription: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real profile update
        return { success: true };
      } catch (error) {
        console.error("[Merchant] Failed to update profile:", error);
        throw error;
      }
    }),

  // Create payment link
  createPaymentLink: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amount: z.number().positive(),
        currency: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real payment link creation
        return { success: true, linkId: "pl_new", url: "https://flatra.app/pay/pl_new" };
      } catch (error) {
        console.error("[Merchant] Failed to create payment link:", error);
        throw error;
      }
    }),

  // Get payment links
  getPaymentLinks: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // TODO: Implement real payment link query
        return [];
      } catch (error) {
        console.error("[Merchant] Failed to get payment links:", error);
        throw error;
      }
    }),

  // Delete payment link
  deletePaymentLink: protectedProcedure
    .input(z.object({ linkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real payment link deletion
        return { success: true };
      } catch (error) {
        console.error("[Merchant] Failed to delete payment link:", error);
        throw error;
      }
    }),

  // Get merchant transactions
  getTransactions: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // TODO: Implement real transaction query
        return [];
      } catch (error) {
        console.error("[Merchant] Failed to get transactions:", error);
        throw error;
      }
    }),
});
