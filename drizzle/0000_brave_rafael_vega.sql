CREATE TYPE "public"."escrow_status" AS ENUM('draft', 'created', 'funded', 'accepted', 'delivered', 'released', 'disputed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."escrow_transaction_type" AS ENUM('products', 'services', 'freelance', 'digital_goods');--> statement-breakpoint
CREATE TYPE "public"."merchant_status" AS ENUM('pending', 'verified', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('deposit', 'withdrawal', 'transfer', 'escrow_funding', 'escrow_release', 'payment');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'merchant', 'admin');--> statement-breakpoint
CREATE TYPE "public"."wallet_type" AS ENUM('fiat', 'crypto');--> statement-breakpoint
CREATE TABLE "auth.users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(320),
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "escrows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"buyer_id" uuid,
	"seller_id" uuid,
	"amount" numeric(20, 8) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"status" "escrow_status" DEFAULT 'draft' NOT NULL,
	"transaction_type" "escrow_transaction_type" DEFAULT 'products',
	"delivery_deadline" timestamp with time zone,
	"funded_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"disputed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid,
	"product_id" uuid,
	"quantity" integer DEFAULT 1,
	"total_amount" numeric(20, 8) NOT NULL,
	"status" "order_status" DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(20, 8) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD',
	"stock" integer DEFAULT 0,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchant_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"customer_id" uuid,
	"amount" numeric(20, 8) NOT NULL,
	"fee" numeric(20, 8) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text NOT NULL,
	"business_logo" text,
	"website" varchar(255),
	"status" "merchant_status" DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"type" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"title" text NOT NULL,
	"amount" numeric(20, 8),
	"currency" varchar(10) DEFAULT 'USD',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"email" varchar(320) NOT NULL,
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"points" integer DEFAULT 0,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_id" uuid NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"currency" varchar(10) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"reference" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"balance" numeric(20, 8) DEFAULT '0' NOT NULL,
	"wallet_type" "wallet_type" DEFAULT 'fiat',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_buyer_id_profiles_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_seller_id_profiles_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_orders" ADD CONSTRAINT "marketplace_orders_buyer_id_profiles_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_orders" ADD CONSTRAINT "marketplace_orders_product_id_marketplace_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."marketplace_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_transactions" ADD CONSTRAINT "merchant_transactions_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_transactions" ADD CONSTRAINT "merchant_transactions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_transactions" ADD CONSTRAINT "merchant_transactions_customer_id_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_auth.users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."auth.users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;