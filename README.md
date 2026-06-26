# FLATRA - Premium Fintech Super App

**The Premium Fintech Super App** - Escrow transactions, instant payments, merchant tools, and crypto utility. All in one elegant platform built for the modern financial world.

## Overview

FLATRA is a full-featured fintech platform providing:

- **Escrow System**: Secure transactions with buyer/seller protection
- **Wallet Management**: Fiat and cryptocurrency balance management
- **Merchant Tools**: Payment links, business profiles, and transaction management
- **Marketplace**: Product listings, orders, and vendor management
- **Crypto Integration**: Real-time cryptocurrency prices and market data
- **Notifications**: Real-time alerts for transaction updates

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with OKLCH colors
- **Vite** - Build tool and dev server
- **tRPC** - End-to-end type-safe APIs
- **Supabase Client** - Authentication and real-time data
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Express 4** - Web server
- **tRPC 11** - Type-safe RPC framework
- **Node.js** - Runtime
- **Supabase PostgreSQL** - Database

### Infrastructure
- **Supabase** - Backend-as-a-Service (Auth, Database, Storage)
- **Vercel** - Deployment platform
- **CoinGecko API** - Real-time crypto data

## Project Structure

```
FLATRA/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/         # Page components (Landing, Login, Dashboard, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities (Supabase client, tRPC)
│   │   ├── _core/         # Core hooks and context
│   │   ├── App.tsx        # Main app with routing
│   │   └── index.css      # Global styles with design tokens
│   ├── public/            # Static assets
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── routers/           # tRPC routers (escrow, wallet, marketplace, etc.)
│   ├── db.ts              # Database queries
│   ├── storage.ts         # S3 storage helpers
│   └── _core/             # Core server infrastructure
├── drizzle/               # Database schema and migrations
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migrations
├── shared/                # Shared types and constants
├── references/            # Integration documentation
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── drizzle.config.ts      # Drizzle ORM config
```

## Features

### 1. Landing Page
Premium dark-themed hero section with feature highlights and CTA buttons for signup/login.

### 2. Authentication
- Email/password signup with auto-profile and wallet creation
- Email/password login with session persistence
- Password reset flow
- Supabase Auth integration

### 3. Dashboard
- Wallet balance overview
- Recent transactions summary
- Quick-action buttons (Send, Receive, Escrow, Pay)
- Live crypto ticker with real-time prices

### 4. Wallet Management
- Fiat wallet balance display
- Crypto wallet integration
- Transaction history with filtering
- Send/Receive capabilities

### 5. Escrow System
- Create escrow transactions with customizable terms
- Escrow hub listing all user transactions
- Detailed escrow status tracking
- Role-based action buttons (Fund, Release, Dispute, Cancel)
- Shareable escrow links for non-registered users

### 6. Merchant Tools
- Merchant registration and profile management
- Payment links for customers
- Transaction history and analytics

### 7. Marketplace
- Product listings with search and filtering
- Order management
- Vendor dashboard

### 8. User Profile & Settings
- Editable profile (name, avatar, phone)
- Notification preferences
- Account security settings

### 9. Notifications
- Real-time notification panel
- Unread/read status tracking
- Email notifications for escrow events

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- Supabase account with project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/clintoniwoloma/FLATRA.git
cd FLATRA
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://user:password@host:5432/flatra

# Manus (optional)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

4. **Set up the database**

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Apply migrations to Supabase
pnpm drizzle-kit migrate
```

5. **Start the development server**

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Development

### Build for production
```bash
pnpm build
```

### Run tests
```bash
pnpm test
```

### Type checking
```bash
pnpm check
```

### Format code
```bash
pnpm format
```

## Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import the GitHub repository
   - Configure environment variables
   - Deploy

### Environment Variables for Production

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
DATABASE_URL=<your-database-url>
VITE_APP_ID=<your-app-id>
JWT_SECRET=<your-jwt-secret>
```

## API Documentation

### tRPC Routers

The backend uses tRPC for type-safe API calls. Available routers:

- **auth** - Authentication (login, logout, session)
- **escrow** - Escrow operations (create, list, update status)
- **wallet** - Wallet operations (balance, transactions)
- **marketplace** - Marketplace operations (products, orders)
- **merchant** - Merchant operations (profile, payment links)
- **profile** - User profile and notifications

### Database Schema

Key tables:
- `profiles` - User profiles
- `wallets` - User wallets (fiat and crypto)
- `transactions` - Transaction history
- `escrows` - Escrow transactions
- `merchants` - Merchant profiles
- `marketplace_products` - Product listings
- `marketplace_orders` - Order history
- `notifications` - User notifications

## Authentication Flow

1. User signs up with email/password
2. Supabase creates `auth.users` record
3. Profile created in `profiles` table
4. Wallet created in `wallets` table (USD fiat, 0 balance)
5. Session stored in Supabase
6. User redirected to dashboard
7. Session persists across page refreshes

## Real-Time Features

- Live crypto price updates via CoinGecko API
- Real-time notifications for transaction updates
- Session persistence across page refreshes

## Security

- Row-Level Security (RLS) policies on all tables
- Supabase Auth for secure authentication
- HTTPS-only communication
- Environment variables for sensitive data
- Type-safe API calls via tRPC

## Performance

- Optimized bundle size (~1.2MB gzipped)
- Code splitting for faster page loads
- Lazy loading for routes
- Efficient database queries with Drizzle ORM

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Format code: `pnpm format`
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please visit:
- GitHub Issues: https://github.com/clintoniwoloma/FLATRA/issues
- Documentation: See `/references` directory for integration guides

## Roadmap

### Phase 2 (Upcoming)
- [ ] Crypto wallet integration (Bitcoin, Ethereum)
- [ ] Fiat gateway integration (Paystack, Flutterwave)
- [ ] Advanced escrow features (multi-sig, time-locks)
- [ ] Merchant analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] DeFi integration
- [ ] Smart contracts
- [ ] Advanced reporting
- [ ] API for third-party integrations

## Contact

- **Website**: https://flatraapp-awycogjl.manus.space
- **Email**: support@flatra.app
- **GitHub**: https://github.com/clintoniwoloma/FLATRA

---

**FLATRA v2.0** - Built with ❤️ for the modern financial world.
