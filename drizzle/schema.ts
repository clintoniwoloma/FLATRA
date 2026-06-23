import { pgTable, text, timestamp, uuid, varchar, numeric, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * FLATRA Database Schema for Supabase PostgreSQL
 * Integrated with Supabase Auth for user management
 */

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "merchant", "admin"]);
export const escrowStatusEnum = pgEnum("escrow_status", ["pending", "funded", "in_progress", "disputed", "released", "cancelled"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "transfer", "escrow_funding", "escrow_release", "payment"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed", "cancelled"]);
export const merchantStatusEnum = pgEnum("merchant_status", ["pending", "verified", "suspended"]);
export const walletTypeEnum = pgEnum("wallet_type", ["fiat", "crypto"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "shipped", "delivered", "cancelled"]);

// Profiles table (extends Supabase Auth)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().references(() => authUsers.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Supabase Auth Users (reference table)
export const authUsers = pgTable("auth.users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 320 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// Wallets table
export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  balance: numeric("balance", { precision: 20, scale: 8 }).default("0").notNull(),
  walletType: walletTypeEnum("wallet_type").default("fiat"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").default("pending").notNull(),
  reference: varchar("reference", { length: 255 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Escrows table
export const escrows = pgTable("escrows", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  buyerId: uuid("buyer_id").references(() => profiles.id, { onDelete: "set null" }),
  sellerId: uuid("seller_id").references(() => profiles.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  status: escrowStatusEnum("status").default("pending").notNull(),
  inspectionPeriodDays: integer("inspection_period_days").default(3),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Merchants table
export const merchants = pgTable("merchants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  businessName: text("business_name").notNull(),
  businessLogo: text("business_logo"),
  website: varchar("website", { length: 255 }),
  status: merchantStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Merchant Transactions table
export const merchantTransactions = pgTable("merchant_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantId: uuid("merchant_id").notNull().references(() => merchants.id, { onDelete: "cascade" }),
  transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => profiles.id),
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  fee: numeric("fee", { precision: 20, scale: 8 }).default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Payment Links table
export const paymentLinks = pgTable("payment_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantId: uuid("merchant_id").notNull().references(() => merchants.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 20, scale: 8 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Marketplace Products table
export const marketplaceProducts = pgTable("marketplace_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantId: uuid("merchant_id").notNull().references(() => merchants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  stock: integer("stock").default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Marketplace Orders table
export const marketplaceOrders = pgTable("marketplace_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id").references(() => profiles.id, { onDelete: "set null" }),
  productId: uuid("product_id").references(() => marketplaceProducts.id, { onDelete: "set null" }),
  quantity: integer("quantity").default(1),
  totalAmount: numeric("total_amount", { precision: 20, scale: 8 }).notNull(),
  status: orderStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  points: integer("points").default(0),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  type: varchar("type", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many, one }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  buyerEscrows: many(escrows, { relationName: "buyer" }),
  sellerEscrows: many(escrows, { relationName: "seller" }),
  merchants: many(merchants),
  rewards: many(rewards),
  notifications: many(notifications),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(profiles, { fields: [wallets.userId], references: [profiles.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(profiles, { fields: [transactions.userId], references: [profiles.id] }),
  wallet: one(wallets, { fields: [transactions.walletId], references: [wallets.id] }),
}));

export const escrowsRelations = relations(escrows, ({ one }) => ({
  buyer: one(profiles, { fields: [escrows.buyerId], references: [profiles.id], relationName: "buyer" }),
  seller: one(profiles, { fields: [escrows.sellerId], references: [profiles.id], relationName: "seller" }),
}));

export const merchantsRelations = relations(merchants, ({ one, many }) => ({
  user: one(profiles, { fields: [merchants.userId], references: [profiles.id] }),
  transactions: many(merchantTransactions),
  products: many(marketplaceProducts),
  paymentLinks: many(paymentLinks),
}));

export const marketplaceProductsRelations = relations(marketplaceProducts, ({ one, many }) => ({
  merchant: one(merchants, { fields: [marketplaceProducts.merchantId], references: [merchants.id] }),
  orders: many(marketplaceOrders),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, { fields: [notifications.userId], references: [profiles.id] }),
}));

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type Escrow = typeof escrows.$inferSelect;
export type InsertEscrow = typeof escrows.$inferInsert;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = typeof merchants.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
