import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionDetailsModal } from "@/components/TransactionDetailsModal";
import { Search, Filter, Download, ArrowDownLeft, Send } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "escrow_funding" | "escrow_release" | "payment";
  status: "pending" | "completed" | "failed";
  amount: number;
  currency: string;
  description: string;
  counterparty?: string;
  date: string;
  time: string;
}

interface TransactionDetail {
  id: string;
  type: 'send' | 'receive' | 'escrow' | 'payment';
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  from: { name: string; address: string };
  to: { name: string; address: string };
  date: Date;
  description?: string;
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: "tx_001",
      type: "escrow_release",
      status: "completed",
      amount: 500,
      currency: "USD",
      description: "Escrow Release - Laptop Purchase",
      counterparty: "John Seller",
      date: "2026-06-23",
      time: "14:30",
    },
    {
      id: "tx_002",
      type: "transfer",
      status: "completed",
      amount: 250,
      currency: "USD",
      description: "Payment to Alice",
      counterparty: "Alice Developer",
      date: "2026-06-22",
      time: "10:15",
    },
    {
      id: "tx_003",
      type: "escrow_funding",
      status: "completed",
      amount: 2000,
      currency: "USD",
      description: "Escrow Funding - Freelance Project",
      counterparty: "Bob Freelancer",
      date: "2026-06-20",
      time: "09:45",
    },
    {
      id: "tx_004",
      type: "deposit",
      status: "completed",
      amount: 1500,
      currency: "USD",
      description: "Bank Deposit",
      date: "2026-06-18",
      time: "16:20",
    },
    {
      id: "tx_005",
      type: "payment",
      status: "pending",
      amount: 350,
      currency: "USD",
      description: "Payment Link - Store Purchase",
      counterparty: "Online Store",
      date: "2026-06-17",
      time: "11:00",
    },
    {
      id: "tx_006",
      type: "withdrawal",
      status: "completed",
      amount: 1000,
      currency: "USD",
      description: "Withdrawal to Bank Account",
      date: "2026-06-15",
      time: "13:30",
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterparty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || tx.type === filterType;
    const matchesStatus = !filterStatus || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "escrow_release":
        return <ArrowDownLeft className="w-5 h-5 text-success" />;
      case "withdrawal":
      case "transfer":
      case "escrow_funding":
      case "payment":
        return <Send className="w-5 h-5 text-foreground" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground mt-2">View and manage all your transactions</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by description, counterparty, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(null)}
              >
                All
              </Button>
              {["deposit", "withdrawal", "transfer", "escrow_funding", "escrow_release", "payment"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="capitalize"
                >
                  {type.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(null)}
              >
                All
              </Button>
              {["pending", "completed", "failed"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <Card
                key={tx.id}
                className="p-6 hover:border-primary/40 cursor-pointer transition-colors"
                onClick={() => {
                  const detail: TransactionDetail = {
                    id: tx.id,
                    type: tx.type.includes('escrow') ? 'escrow' : tx.type === 'transfer' ? 'send' : 'receive',
                    amount: tx.amount.toString(),
                    currency: tx.currency,
                    status: tx.status === 'completed' ? 'completed' : tx.status === 'pending' ? 'pending' : 'failed',
                    from: { name: 'Your Account', address: 'wallet_address_1' },
                    to: { name: tx.counterparty || 'Bank', address: 'wallet_address_2' },
                    date: new Date(tx.date),
                    description: tx.description,
                  };
                  setSelectedTransaction(detail);
                  setModalOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold truncate">{tx.description}</p>
                        <Badge variant="outline" className={`capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tx.counterparty ? `with ${tx.counterparty}` : ""} • {tx.date} at {tx.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.type === "deposit" || tx.type === "escrow_release" ? "text-success" : "text-foreground"}`}>
                      {tx.type === "deposit" || tx.type === "escrow_release" ? "+" : "-"}
                      {tx.currency} {tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.type.replace("_", " ")}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No transactions found</p>
          </Card>
        )}

        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}
