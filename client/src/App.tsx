import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import Dashboard from "./pages/Dashboard";
import EscrowHub from "./pages/EscrowHub";
import CreateEscrow from "./pages/CreateEscrow";
import EscrowDetails from "./pages/EscrowDetails";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Crypto from "./pages/Crypto";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Merchant from "./pages/Merchant";
import Marketplace from "./pages/Marketplace";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/password-reset"} component={PasswordReset} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/escrow"} component={EscrowHub} />
      <Route path={"/escrow/create"} component={CreateEscrow} />
      <Route path={"/escrow/:id"} component={EscrowDetails} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/transactions"} component={Transactions} />
      <Route path={"/crypto"} component={Crypto} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/merchant"} component={Merchant} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
