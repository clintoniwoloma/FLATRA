-- FLATRA Supabase Schema Migration

-- 1. Profiles Table (Extends Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'merchant', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
    wallet_type TEXT DEFAULT 'fiat' CHECK (wallet_type IN ('fiat', 'crypto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, currency)
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer', 'escrow_funding', 'escrow_release', 'payment')),
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Escrows Table
CREATE TABLE IF NOT EXISTS escrows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'funded', 'in_progress', 'disputed', 'released', 'cancelled')),
    inspection_period_days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    business_logo TEXT,
    website TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Merchant Transactions
CREATE TABLE IF NOT EXISTS merchant_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES profiles(id),
    amount DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Payment Links
CREATE TABLE IF NOT EXISTS payment_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    amount DECIMAL(20, 8),
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Marketplace Products
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(20, 8) NOT NULL,
    currency TEXT DEFAULT 'USD',
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Marketplace Orders
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES marketplace_products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(20, 8) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    points INTEGER DEFAULT 0,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS POLICIES

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallets." ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions." ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Escrows
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view involved escrows." ON escrows FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create escrows." ON escrows FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications." ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON notifications FOR UPDATE USING (auth.uid() = user_id);
