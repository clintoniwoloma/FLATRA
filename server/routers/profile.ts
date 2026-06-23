import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const profileRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      // TODO: Implement real profile query from Supabase
      return {
        id: ctx.user?.id,
        fullName: ctx.user?.fullName,
        email: ctx.user?.email,
        phone: null,
        avatar: null,
      };
    } catch (error) {
      console.error("[Profile] Failed to get profile:", error);
      throw error;
    }
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        phone: z.string().optional(),
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real profile update
        return { success: true };
      } catch (error) {
        console.error("[Profile] Failed to update profile:", error);
        throw error;
      }
    }),

  // Get notification preferences
  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    try {
      // TODO: Implement real preferences query
      return {
        emailOnEscrowUpdate: true,
        emailOnTransaction: true,
        emailOnDispute: true,
        emailMarketing: false,
        pushNotifications: true,
      };
    } catch (error) {
      console.error("[Profile] Failed to get notification preferences:", error);
      throw error;
    }
  }),

  // Update notification preferences
  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        emailOnEscrowUpdate: z.boolean().optional(),
        emailOnTransaction: z.boolean().optional(),
        emailOnDispute: z.boolean().optional(),
        emailMarketing: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real preferences update
        return { success: true };
      } catch (error) {
        console.error("[Profile] Failed to update notification preferences:", error);
        throw error;
      }
    }),

  // Get notifications
  getNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // TODO: Implement real notifications query
        return [];
      } catch (error) {
        console.error("[Profile] Failed to get notifications:", error);
        throw error;
      }
    }),

  // Mark notification as read
  markNotificationAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real mark as read
        return { success: true };
      } catch (error) {
        console.error("[Profile] Failed to mark notification as read:", error);
        throw error;
      }
    }),

  // Delete notification
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement real notification deletion
        return { success: true };
      } catch (error) {
        console.error("[Profile] Failed to delete notification:", error);
        throw error;
      }
    }),
});
