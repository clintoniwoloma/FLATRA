# FLATRA Architecture Documentation

## System Overview

FLATRA is a full-stack fintech platform built with a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  React 19 + TypeScript + Tailwind CSS + Vite                    │
│  ├─ Landing Page                                                │
│  ├─ Authentication (Login, Signup, Password Reset)              │
│  ├─ Dashboard (Wallet Overview, Quick Actions)                  │
│  ├─ Wallet Management (Fiat & Crypto)                           │
│  ├─ Escrow System (Hub, Create, Details)                        │
│  ├─ Merchant Tools (Profile, Payment Links)                     │
│  ├─ Marketplace (Products, Orders)                              │
│  ├─ User Profile & Settings                                     │
│  └─ Notifications Panel                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    tRPC Type-Safe APIs
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Layer                               │
│  Express 4 + Node.js + tRPC 11                                  │
│  ├─ Auth Router (login, logout, session)                        │
│  ├─ Escrow Router (CRUD, status updates)                        │
│  ├─ Wallet Router (balance, transactions)                       │
│  ├─ Marketplace Router (products, orders)                       │
│  ├─ Merchant Router (profile, payment links)                    │
│  └─ Profile Router (user data, notifications)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data & Services Layer                         │
│  ├─ Supabase PostgreSQL Database                                │
│  ├─ Supabase Auth (Email/Password + OAuth)                      │
│  ├─ Supabase Storage (File uploads)                             │
│  ├─ CoinGecko API (Crypto prices)                               │
│  └─ Email Service (Notifications)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Pages & Routing

| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Marketing page with feature highlights |
| Login | `/login` | Email/password authentication |
| Signup | `/signup` | User registration with profile creation |
| Password Reset | `/password-reset` | Account recovery |
| Dashboard | `/dashboard` | Home page with wallet overview |
| Wallet | `/wallet` | Balance management and history |
| Transactions | `/transactions` | Transaction history with filters |
| Crypto | `/crypto` | Real-time crypto market data |
| Escrow Hub | `/escrow` | List all escrows |
| Create Escrow | `/escrow/create` | Create new escrow transaction |
| Escrow Details | `/escrow/:id` | View escrow details and timeline |
| Merchant | `/merchant` | Merchant dashboard |
| Marketplace | `/marketplace` | Product listings and orders |
| Profile | `/profile` | User settings and preferences |
| Notifications | `/notifications` | Notification center |

### Component Structure

```
client/src/
├── pages/                    # Page-level components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Wallet.tsx
│   ├── Transactions.tsx
│   ├── Crypto.tsx
│   ├── EscrowHub.tsx
│   ├── CreateEscrow.tsx
│   ├── EscrowDetails.tsx
│   ├── Merchant.tsx
│   ├── Marketplace.tsx
│   ├── Profile.tsx
│   └── Notifications.tsx
├── components/               # Reusable components
│   ├── DashboardLayout.tsx  # Main dashboard layout with sidebar
│   ├── AIChatBox.tsx        # Chat interface
│   ├── Map.tsx              # Google Maps integration
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase.ts          # Supabase client and auth helpers
│   ├── trpc.ts              # tRPC client setup
│   └── utils.ts             # Utility functions
├── _core/
│   ├── hooks/
│   │   ├── useSupabaseAuth.ts  # Supabase authentication hook
│   │   └── useAuth.ts          # Deprecated (redirects to useSupabaseAuth)
│   └── context/             # React contexts
├── App.tsx                  # Main app with routing
├── main.tsx                 # React entry point
└── index.css                # Global styles with design tokens
```

### Design System

**Color Palette (OKLCH):**
- Primary: `#7C3AED` (Purple)
- Secondary: `#2563EB` (Blue)
- Accent: `#10B981` (Green)
- Background: `#0F172A` (Dark)
- Foreground: `#F8FAFC` (Light)

**Typography:**
- Headings: Poppins (600-700 weight)
- Body: Inter (400-500 weight)

**Spacing:** 4px base unit (Tailwind default)

**Border Radius:** 20px (premium aesthetic)

## Backend Architecture

### tRPC Routers

```typescript
appRouter
├── auth
│   ├── me.query()           // Get current user
│   └── logout.mutation()    // Clear session
├── escrow
│   ├── list.query()         // Get user escrows
│   ├── create.mutation()    // Create new escrow
│   ├── getById.query()      // Get escrow details
│   ├── updateStatus.mutation() // Update escrow status
│   └── delete.mutation()    // Cancel escrow
├── wallet
│   ├── getBalance.query()   // Get wallet balance
│   ├── getTransactions.query() // Get transaction history
│   ├── transfer.mutation()  // Transfer funds
│   └── addFunds.mutation()  // Add funds to wallet
├── marketplace
│   ├── listProducts.query() // Get products
│   ├── createProduct.mutation() // Create product
│   ├── listOrders.query()   // Get orders
│   └── createOrder.mutation() // Create order
├── merchant
│   ├── getProfile.query()   // Get merchant profile
│   ├── updateProfile.mutation() // Update profile
│   ├── createPaymentLink.mutation() // Create payment link
│   └── listPaymentLinks.query() // Get payment links
└── profile
    ├── getProfile.query()   // Get user profile
    ├── updateProfile.mutation() // Update profile
    ├── getNotifications.query() // Get notifications
    └── markAsRead.mutation() // Mark notification as read
```

### Database Schema

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  fullName VARCHAR(255),
  avatarUrl TEXT,
  phone VARCHAR(20),
  role ENUM('user', 'merchant', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### wallets
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(id),
  balance DECIMAL(18, 8) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  type ENUM('fiat', 'crypto') DEFAULT 'fiat',
  cryptoType VARCHAR(50), -- e.g., 'BTC', 'ETH'
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fromUserId UUID NOT NULL REFERENCES profiles(id),
  toUserId UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(18, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  type ENUM('transfer', 'payment', 'escrow_fund', 'escrow_release') DEFAULT 'transfer',
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  description TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### escrows
```sql
CREATE TABLE escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyerId UUID NOT NULL REFERENCES profiles(id),
  sellerId UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(18, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status ENUM('pending', 'funded', 'in_progress', 'disputed', 'released', 'cancelled') DEFAULT 'pending',
  inspectionPeriodDays INT DEFAULT 3,
  fundedAt TIMESTAMP,
  releasedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### merchants
```sql
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES profiles(id),
  businessName VARCHAR(255) NOT NULL,
  businessDescription TEXT,
  businessCategory VARCHAR(100),
  verificationStatus ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### marketplace_products
```sql
CREATE TABLE marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchantId UUID NOT NULL REFERENCES merchants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(18, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  category VARCHAR(100),
  imageUrl TEXT,
  stock INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(id),
  type ENUM('escrow_funded', 'escrow_released', 'payment_received', 'order_status') DEFAULT 'payment_received',
  title VARCHAR(255) NOT NULL,
  message TEXT,
  relatedId UUID, -- ID of related escrow/transaction/order
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## Authentication Flow

### Signup Flow
```
1. User fills signup form (email, password, full name)
   ↓
2. Frontend calls signUpWithEmail()
   ↓
3. Supabase creates auth.users record
   ↓
4. Profile created in profiles table
   ↓
5. Wallet created in wallets table (USD fiat, 0 balance)
   ↓
6. Session stored in Supabase
   ↓
7. User redirected to dashboard
   ↓
8. Session persists across page refreshes
```

### Login Flow
```
1. User enters email/password
   ↓
2. Frontend calls signInWithEmail()
   ↓
3. Supabase validates credentials
   ↓
4. Session created
   ↓
5. User redirected to dashboard
```

### Session Management
- Sessions stored in Supabase
- Session token sent with each request
- Automatic refresh on page reload
- Logout clears session

## API Integration

### Supabase
- **Auth**: Email/password authentication
- **Database**: PostgreSQL with RLS policies
- **Storage**: File uploads for avatars, documents
- **Real-time**: WebSocket subscriptions for live updates

### CoinGecko
- **Endpoint**: https://api.coingecko.com/api/v3
- **Data**: Real-time crypto prices, market trends
- **Rate Limit**: 10-50 calls/minute (free tier)

### Email Service (Future)
- Automated notifications for escrow events
- Password reset emails
- Transaction confirmations

## Security

### Row-Level Security (RLS)
All tables have RLS policies:
- Users can only view/edit their own data
- Admins have full access
- Public read access for marketplace products

### Authentication
- Supabase Auth handles password hashing
- Session tokens validated on each request
- HTTPS-only communication
- CORS configured for allowed origins

### Data Protection
- Environment variables for sensitive data
- No hardcoded secrets
- Database credentials in `.env.local`

## Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading for routes
- Image optimization
- CSS minification

### Backend
- Database query optimization with Drizzle ORM
- Connection pooling
- Caching strategies
- Efficient pagination

### Bundle Size
- Production build: ~1.2MB gzipped
- Main bundle: ~305KB gzipped
- CSS bundle: ~19KB gzipped

## Deployment

### Vercel
- Automatic deployments from GitHub
- Environment variables configured in Vercel dashboard
- Serverless functions for backend
- Edge caching for static assets

### Database
- Supabase hosted PostgreSQL
- Automatic backups
- SSL encryption
- Point-in-time recovery

## Monitoring & Logging

### Frontend
- Browser console logs
- Error tracking (future: Sentry)
- Performance metrics (future: Web Vitals)

### Backend
- Server logs in `.manus-logs/`
- Database query logs
- Error tracking (future: Sentry)

## Future Enhancements

### Phase 2
- Crypto wallet integration (Bitcoin, Ethereum)
- Fiat gateway (Paystack, Flutterwave)
- Advanced escrow features
- Merchant analytics

### Phase 3
- DeFi integration
- Smart contracts
- Mobile app
- Advanced reporting

## Development Workflow

1. Create feature branch
2. Make changes
3. Run tests: `pnpm test`
4. Format code: `pnpm format`
5. Type check: `pnpm check`
6. Build: `pnpm build`
7. Submit PR

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` in `.env.local`
- Verify Supabase project is active
- Check network connectivity

### Authentication Errors
- Verify Supabase credentials
- Check email/password format
- Clear browser cache and cookies

### Build Errors
- Clear `node_modules` and reinstall: `pnpm install`
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `pnpm check`

---

**FLATRA Architecture** - Designed for scalability, security, and performance.
