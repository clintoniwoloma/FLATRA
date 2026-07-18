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

/**
 * Crypto cache helpers - store CoinGecko snapshots for quick reads
 */
export async function ensureCryptoCacheTable(): Promise<void> {
  if (!_client) return;
  try {
    await _client.query(
      `CREATE TABLE IF NOT EXISTS crypto_cache (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        price NUMERIC(30,8) NOT NULL,
        market_cap NUMERIC(40,2) NOT NULL,
        volume24h NUMERIC(40,2) NOT NULL,
        change24h NUMERIC(20,8) NOT NULL,
        change7d NUMERIC(20,8),
        change30d NUMERIC(20,8),
        image TEXT,
        updated_at TIMESTAMPTZ DEFAULT now()
      );`
    );
  } catch (e) {
    console.warn("[Database] Failed to ensure crypto_cache table:", e);
  }
}

export type CryptoCacheRow = {
  id: string;
  data: any;
  price: string;
  market_cap: string;
  volume24h: string;
  change24h: string;
  change7d: string | null;
  change30d: string | null;
  image: string | null;
  updated_at: string;
};

export async function getCryptoCache(limit: number = 10): Promise<CryptoCacheRow[]> {
  if (!_client) return [];
  try {
    await ensureCryptoCacheTable();
    const res = await _client.query(`SELECT id, data, price, market_cap, volume24h, change24h, change7d, change30d, image, updated_at FROM crypto_cache ORDER BY market_cap::numeric DESC LIMIT $1`, [limit]);
    return res.map((r: any) => ({
      id: r.id,
      data: r.data,
      price: r.price,
      market_cap: r.market_cap,
      volume24h: r.volume24h,
      change24h: r.change24h,
      change7d: r.change7d,
      change30d: r.change30d,
      image: r.image,
      updated_at: r.updated_at,
    }));
  } catch (e) {
    console.warn("[Database] Failed to read crypto_cache:", e);
    return [];
  }
}

export async function getCryptoCacheById(id: string): Promise<CryptoCacheRow | null> {
  if (!_client) return null;
  try {
    await ensureCryptoCacheTable();
    const res = await _client.query(`SELECT id, data, price, market_cap, volume24h, change24h, change7d, change30d, image, updated_at FROM crypto_cache WHERE id = $1 LIMIT 1`, [id]);
    if (res.length === 0) return null;
    const r = res[0];
    return {
      id: r.id,
      data: r.data,
      price: r.price,
      market_cap: r.market_cap,
      volume24h: r.volume24h,
      change24h: r.change24h,
      change7d: r.change7d,
      change30d: r.change30d,
      image: r.image,
      updated_at: r.updated_at,
    };
  } catch (e) {
    console.warn("[Database] Failed to read crypto_cache by id:", e);
    return null;
  }
}

export async function upsertCryptoCacheRows(rows: Array<{ id: string; data: any; price: number; marketCap: number; volume24h: number; change24h: number; change7d?: number | null; change30d?: number | null; image?: string | null; }>): Promise<void> {
  if (!_client) return;
  try {
    await ensureCryptoCacheTable();
    const q = `INSERT INTO crypto_cache (id, data, price, market_cap, volume24h, change24h, change7d, change30d, image, updated_at) VALUES `;
    const parts: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    for (const row of rows) {
      parts.push(`($${idx++}, $${idx++}::jsonb, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, now())`);
      vals.push(row.id, JSON.stringify(row.data), String(row.price), String(row.marketCap), String(row.volume24h), String(row.change24h), row.change7d != null ? String(row.change7d) : null, row.change30d != null ? String(row.change30d) : null, row.image || null);
    }
    const sql = q + parts.join(",") + ` ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, price = EXCLUDED.price, market_cap = EXCLUDED.market_cap, volume24h = EXCLUDED.volume24h, change24h = EXCLUDED.change24h, change7d = EXCLUDED.change7d, change30d = EXCLUDED.change30d, image = EXCLUDED.image, updated_at = now()`;
    await _client.query(sql, vals);
  } catch (e) {
    console.warn("[Database] Failed to upsert crypto_cache rows:", e);
  }
}
