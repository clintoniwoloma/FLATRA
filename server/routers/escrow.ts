import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import {
  createEscrow,
  getEscrowById,
  getEscrowsByBuyer,
  getEscrowsBySeller,
  updateEscrowStatus,
  getProfileByEmail,
  createNotification,
} from "../db";
import { TRPCError } from "@trpc/server";

export const escrowRouter = router({
  // Get all escrows for the current user (as buyer or seller)
  listEscrows: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().default(50),
          offset: z.number().default(0),
          role: z.enum(["buyer", "seller", "all"]).default("all"),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const buyerEscrows = input?.role !== "seller" ? await getEscrowsByBuyer(userId) : [];
        const sellerEscrows = input?.role !== "buyer" ? await getEscrowsBySeller(userId) : [];

        const allEscrows = [...buyerEscrows, ...sellerEscrows].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return allEscrows.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 50));
      } catch (error) {
        console.error("[Escrow] Failed to list escrows:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Get single escrow details
  getEscrow: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const escrow = await getEscrowById(input.id);
        return escrow || null;
      } catch (error) {
        console.error("[Escrow] Failed to get escrow:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Create new escrow
  createEscrow: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().max(2000).optional(),
        sellerEmail: z.string().email(),
        amount: z.string().regex(/^\d+(\.\d{1,8})?$/),
        currency: z.string().default("USD"),
        transactionType: z.enum(["products", "services", "freelance", "digital_goods"]).default("products"),
        deliveryDeadlineDays: z.number().positive().default(7),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const buyerId = ctx.user?.id;
      if (!buyerId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        // Find seller by email
        const seller = await getProfileByEmail(input.sellerEmail);
        if (!seller) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Seller not found",
          });
        }

        if (seller.id === buyerId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot create escrow with yourself",
          });
        }

        // Calculate delivery deadline
        const deliveryDeadline = new Date();
        deliveryDeadline.setDate(deliveryDeadline.getDate() + input.deliveryDeadlineDays);

        // Create escrow
        const escrow = await createEscrow({
          title: input.title,
          description: input.description,
          buyerId,
          sellerId: seller.id,
          amount: input.amount,
          currency: input.currency,
          transactionType: input.transactionType,
          deliveryDeadline,
          status: "created",
        });

        if (!escrow) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create escrow",
          });
        }

        // Create notification for seller
        await createNotification({
          userId: seller.id,
          title: "New Escrow Created",
          message: `${ctx.user?.fullName || "A buyer"} created an escrow for ${input.title}`,
          type: "escrow_created",
        });

        return escrow;
      } catch (error) {
        console.error("[Escrow] Failed to create escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Fund escrow (buyer action)
  fundEscrow: protectedProcedure
    .input(z.object({ escrowId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.buyerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only buyer can fund escrow" });
        }

        if (escrow.status !== "created") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot fund escrow in ${escrow.status} status`,
          });
        }

        // Update status to funded
        const updated = await updateEscrowStatus(input.escrowId, "funded");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Update funded_at timestamp
        const db = await getDb();
        if (db) {
          const { escrows } = await import("../../drizzle/schema");
          await db
            .update(escrows)
            .set({ fundedAt: new Date() })
            .where(eq(escrows.id, input.escrowId));
        }

        // Notify seller
        if (escrow.sellerId) {
          await createNotification({
            userId: escrow.sellerId,
            title: "Escrow Funded",
            message: `Escrow for "${escrow.title}" has been funded`,
            type: "escrow_funded",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to fund escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Accept escrow (seller action)
  acceptEscrow: protectedProcedure
    .input(z.object({ escrowId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.sellerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only seller can accept escrow" });
        }

        if (escrow.status !== "funded") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot accept escrow in ${escrow.status} status`,
          });
        }

        // Update status to accepted
        const updated = await updateEscrowStatus(input.escrowId, "accepted");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Update accepted_at timestamp
        const db = await getDb();
        if (db) {
          const { escrows } = await import("../../drizzle/schema");
          await db
            .update(escrows)
            .set({ acceptedAt: new Date() })
            .where(eq(escrows.id, input.escrowId));
        }

        // Notify buyer
        if (escrow.buyerId) {
          await createNotification({
            userId: escrow.buyerId,
            title: "Escrow Accepted",
            message: `Seller accepted escrow for "${escrow.title}"`,
            type: "escrow_accepted",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to accept escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Mark as delivered (seller action)
  markDelivered: protectedProcedure
    .input(z.object({ escrowId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.sellerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only seller can mark as delivered" });
        }

        if (escrow.status !== "accepted") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot mark delivered in ${escrow.status} status`,
          });
        }

        // Update status to delivered
        const updated = await updateEscrowStatus(input.escrowId, "delivered");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Update delivered_at timestamp
        const db = await getDb();
        if (db) {
          const { escrows } = await import("../../drizzle/schema");
          await db
            .update(escrows)
            .set({ deliveredAt: new Date() })
            .where(eq(escrows.id, input.escrowId));
        }

        // Notify buyer
        if (escrow.buyerId) {
          await createNotification({
            userId: escrow.buyerId,
            title: "Delivery Submitted",
            message: `Seller submitted delivery for "${escrow.title}"`,
            type: "escrow_delivered",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to mark delivered:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Release funds (buyer action)
  releaseEscrow: protectedProcedure
    .input(z.object({ escrowId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.buyerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only buyer can release funds" });
        }

        if (escrow.status !== "delivered") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot release funds in ${escrow.status} status`,
          });
        }

        // Update status to released
        const updated = await updateEscrowStatus(input.escrowId, "released");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Update released_at timestamp
        const db = await getDb();
        if (db) {
          const { escrows } = await import("../../drizzle/schema");
          await db
            .update(escrows)
            .set({ releasedAt: new Date() })
            .where(eq(escrows.id, input.escrowId));
        }

        // Notify seller
        if (escrow.sellerId) {
          await createNotification({
            userId: escrow.sellerId,
            title: "Funds Released",
            message: `Funds released for "${escrow.title}"`,
            type: "escrow_released",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to release escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Open dispute
  disputeEscrow: protectedProcedure
    .input(
      z.object({
        escrowId: z.string().uuid(),
        reason: z.string().min(10).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.buyerId !== userId && escrow.sellerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only participants can dispute" });
        }

        if (!["delivered", "accepted", "funded"].includes(escrow.status)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot dispute escrow in ${escrow.status} status`,
          });
        }

        // Update status to disputed
        const updated = await updateEscrowStatus(input.escrowId, "disputed");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Update disputed_at timestamp
        const db = await getDb();
        if (db) {
          const { escrows } = await import("../../drizzle/schema");
          await db
            .update(escrows)
            .set({ disputedAt: new Date() })
            .where(eq(escrows.id, input.escrowId));
        }

        // Notify other party
        const otherUserId = escrow.buyerId === userId ? escrow.sellerId : escrow.buyerId;
        if (otherUserId) {
          await createNotification({
            userId: otherUserId,
            title: "Dispute Opened",
            message: `A dispute has been opened for "${escrow.title}": ${input.reason}`,
            type: "escrow_disputed",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to dispute escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Cancel escrow
  cancelEscrow: protectedProcedure
    .input(z.object({ escrowId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const escrow = await getEscrowById(input.escrowId);
        if (!escrow) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Escrow not found" });
        }

        if (escrow.buyerId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only buyer can cancel escrow" });
        }

        if (!["created", "funded"].includes(escrow.status)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot cancel escrow in ${escrow.status} status`,
          });
        }

        // Update status to cancelled
        const updated = await updateEscrowStatus(input.escrowId, "cancelled");
        if (!updated) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        // Notify seller
        if (escrow.sellerId) {
          await createNotification({
            userId: escrow.sellerId,
            title: "Escrow Cancelled",
            message: `Escrow for "${escrow.title}" has been cancelled`,
            type: "escrow_cancelled",
          });
        }

        return { success: true, escrow: updated };
      } catch (error) {
        console.error("[Escrow] Failed to cancel escrow:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
