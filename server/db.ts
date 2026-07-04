import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { profiles, wallets, escrows, notifications, type InsertProfile, type Profile, type Escrow, type InsertEscrow, type Notification, type InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function closeDb() {
  if (_client) {
    await _client.end();
    _db = null;
    _client = null;
  }
}

/**
 * Upsert a profile in the database
 * This is called during OAuth callback to sync user info
 */
export async function upsertProfile(profile: {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: "user" | "merchant" | "admin";
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert profile: database not available");
    return;
  }

  try {
    const values: InsertProfile = {
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      role: profile.role ?? "user",
    };

    // Upsert profile
    await db
      .insert(profiles)
      .values(values)
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          fullName: values.fullName,
          avatarUrl: values.avatarUrl,
          updatedAt: new Date(),
        },
      });

    // Create default wallet if doesn't exist
    const existingWallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, profile.id))
      .limit(1);

    if (existingWallet.length === 0) {
      await db.insert(wallets).values({
        userId: profile.id,
        currency: "USD",
        balance: "0",
        walletType: "fiat",
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert profile:", error);
    throw error;
  }
}

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get profile: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get a profile by email
 */
export async function getProfileByEmail(email: string): Promise<Profile | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get profile: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Escrow Database Helpers
 */

export async function createEscrow(data: InsertEscrow): Promise<Escrow | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create escrow: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(escrows).values(data).returning();
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create escrow:", error);
    throw error;
  }
}

export async function getEscrowById(id: string): Promise<Escrow | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(escrows)
    .where(eq(escrows.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEscrowsByBuyer(buyerId: string): Promise<Escrow[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(escrows)
    .where(eq(escrows.buyerId, buyerId))
    .orderBy((e) => e.createdAt);
}

export async function getEscrowsBySeller(sellerId: string): Promise<Escrow[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(escrows)
    .where(eq(escrows.sellerId, sellerId))
    .orderBy((e) => e.createdAt);
}

export async function updateEscrowStatus(id: string, status: string): Promise<Escrow | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .update(escrows)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(escrows.id, id))
      .returning();

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update escrow status:", error);
    throw error;
  }
}

/**
 * Notification Database Helpers
 */

export async function createNotification(data: InsertNotification): Promise<Notification | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(notifications).values(data).returning();
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    throw error;
  }
}

export async function getNotificationsByUser(userId: string, limit: number = 50): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy((n) => n.createdAt)
    .limit(limit);
}
