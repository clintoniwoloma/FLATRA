# FLATRA Phase 1 TODO

## Landing Page
- [x] Hero section with FLATRA branding
- [x] Feature highlights (Escrow, Wallet, Merchant, Marketplace, Crypto)
- [x] CTA buttons (Login, Signup)
- [x] Premium dark-themed design with smooth animations

## Authentication
- [x] Login page UI with email/password and Manus OAuth
- [x] Signup page UI with email/password and Manus OAuth
- [x] Password Reset page UI
- [ ] Implement real email/password login against Supabase Auth
- [ ] Implement real email/password signup against Supabase Auth with profile/wallet creation
- [ ] Implement functional password reset flow with email delivery and verification
- [ ] Protect authenticated routes and complete session/auth-state handling

## Dashboard
- [x] Dashboard home with wallet balance overview
- [x] Recent transactions summary
- [x] Quick-action buttons (Send, Receive, Escrow, Pay)
- [x] Live crypto ticker powered by CoinGecko (mock data)

## Wallet & Transactions
- [x] Wallet page showing fiat and crypto balances
- [x] Transactions list with filters and search
- [ ] Transaction details modal
- [ ] Send/Receive flow for wallet transfers

## Real-Time Crypto Data
- [x] Crypto page with live crypto prices
- [x] Market trends and sparkline charts (mock data)
- [x] Wallet crypto balance display
- [ ] Integrate CoinGecko MCP for real-time data

## Escrow System
- [x] Escrow Hub listing all user escrows
- [x] Status badges (pending, funded, in_progress, disputed, released, cancelled)
- [x] Filter/search functionality in Escrow Hub
- [x] Create Escrow form (title, description, counterparty, amount, currency, inspection period)
- [x] Escrow Details page with timeline and status history
- [x] Role-based action buttons (Fund, Release, Dispute, Cancel)
- [ ] Shareable escrow links (public access for non-registered users)
- [ ] Escrow link remains live until transaction complete or admin closes

## Merchant & Marketplace
- [x] Merchant registration and profile
- [x] Marketplace products listing
- [x] Marketplace orders management
- [x] Payment links for merchants

## User Profile & Settings
- [x] Editable profile page (full name, avatar, phone)
- [x] Notification preferences
- [x] Account settings

## Notifications
- [x] Notifications panel/drawer
- [x] Mark-as-read functionality
- [x] Unread notification badge
- [ ] Automated email notifications for escrow status changes

## Real-Time Crypto Data
- [ ] CoinGecko integration for live crypto prices
- [ ] Crypto ticker on dashboard
- [ ] Market trends and sparkline charts
- [ ] Wallet crypto balance display

## Backend Integration
- [ ] Supabase database connection
- [ ] User authentication with Supabase Auth
- [ ] Profile creation on signup
- [ ] Wallet creation on signup
- [ ] Escrow CRUD operations
- [ ] Transaction logging
- [ ] Notification system
- [ ] Email notifications for escrow events

## Testing & Deployment
- [ ] Unit tests for critical features
- [ ] Integration tests
- [ ] GitHub commit and push
- [ ] Vercel deployment
- [ ] README documentation
- [ ] Architecture documentation
