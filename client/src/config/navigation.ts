import {
  LayoutDashboard,
  Wallet,
  Shield,
  ShoppingCart,
  TrendingUp,
  Store,
  CreditCard,
  Bell,
  Settings,
  User,
  LogOut,
  Send,
  ArrowDownLeft,
  FileText,
  MoreHorizontal,
  Gift,
  Moon,
  Smartphone,
  Lock,
} from 'lucide-react';

export const DESKTOP_SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet, label: 'Wallets', path: '/wallet' },
  { icon: TrendingUp, label: 'Transactions', path: '/transactions' },
  { icon: Shield, label: 'Escrow', path: '/escrow-hub' },
  { icon: CreditCard, label: 'Payments', path: '/merchant' },
  { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' },
  { icon: TrendingUp, label: 'Crypto', path: '/crypto' },
  { icon: Store, label: 'Merchant', path: '/merchant' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const MOBILE_BOTTOM_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: Shield, label: 'Escrow', path: '/escrow-hub' },
  { icon: ShoppingCart, label: 'Shop', path: '/marketplace' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const MOBILE_FAB_ACTIONS = [
  { icon: Send, label: 'Send Money', path: '/wallet', action: 'send' },
  { icon: ArrowDownLeft, label: 'Request', path: '/wallet', action: 'request' },
  { icon: CreditCard, label: 'Pay Merchant', path: '/merchant', action: 'pay' },
  { icon: FileText, label: 'Create Escrow', path: '/escrow-hub', action: 'create' },
];

export const PROFILE_MENU_ITEMS = [
  { icon: User, label: 'Personal Info', section: 'personal' },
  { icon: Shield, label: 'KYC Verification', section: 'kyc' },
  { icon: TrendingUp, label: 'Referrals', section: 'referrals' },
  { icon: Gift, label: 'Rewards', section: 'rewards' },
];

export const SETTINGS_MENU_ITEMS = [
  { icon: Moon, label: 'Appearance', section: 'appearance' },
  { icon: Lock, label: 'Security', section: 'security' },
  { icon: Smartphone, label: 'Devices', section: 'devices' },
  { icon: Bell, label: 'Notifications', section: 'notifications' },
];

export const ESCROW_TABS = [
  { id: 'active', label: 'Active', count: 3 },
  { id: 'pending', label: 'Pending', count: 2 },
  { id: 'completed', label: 'Completed', count: 12 },
  { id: 'disputes', label: 'Disputes', count: 0 },
];
