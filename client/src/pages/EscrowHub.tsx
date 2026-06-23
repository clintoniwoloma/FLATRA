import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Filter } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  funded: "bg-blue-500/10 text-blue-700 border-blue-200",
  in_progress: "bg-purple-500/10 text-purple-700 border-purple-200",
  disputed: "bg-red-500/10 text-red-700 border-red-200",
  released: "bg-green-500/10 text-green-700 border-green-200",
  cancelled: "bg-gray-500/10 text-gray-700 border-gray-200",
};

export default function EscrowHub() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading] = useState(false);

  // Mock escrow data
  const escrows = [
    {
      id: "esc_001",
      title: "Laptop Purchase",
      counterparty: "John Seller",
      amount: 1200,
      currency: "USD",
      status: "funded",
      role: "buyer",
      createdAt: "2026-06-20",
    },
    {
      id: "esc_002",
      title: "Freelance Project Payment",
      counterparty: "Alice Developer",
      amount: 500,
      currency: "USD",
      status: "in_progress",
      role: "buyer",
      createdAt: "2026-06-18",
    },
    {
      id: "esc_003",
      title: "Art Commission",
      counterparty: "Bob Artist",
      amount: 300,
      currency: "USD",
      status: "pending",
      role: "seller",
      createdAt: "2026-06-15",
    },
    {
      id: "esc_004",
      title: "Camera Equipment",
      counterparty: "Carol Photographer",
      amount: 2500,
      currency: "USD",
      status: "released",
      role: "seller",
      createdAt: "2026-06-10",
    },
  ];

  const filteredEscrows = escrows.filter((escrow) => {
    const matchesSearch =
      escrow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escrow.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || escrow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Escrow Hub</h1>
            <p className="text-muted-foreground mt-2">Manage all your escrow transactions</p>
          </div>
          <Button onClick={() => setLocation("/escrow/create")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Escrow
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or counterparty..."
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

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(null)}
          >
            All
          </Button>
          {["pending", "funded", "in_progress", "disputed", "released", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>

        {/* Escrows List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : filteredEscrows.length > 0 ? (
          <div className="space-y-4">
            {filteredEscrows.map((escrow) => (
              <Card
                key={escrow.id}
                className="p-6 hover:border-primary/40 cursor-pointer transition-colors"
                onClick={() => setLocation(`/escrow/${escrow.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{escrow.title}</h3>
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusColors[escrow.status]}`}
                      >
                        {escrow.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {escrow.role}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      with <span className="font-medium">{escrow.counterparty}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created on {new Date(escrow.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {escrow.currency} {escrow.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No escrows found</p>
            <Button onClick={() => setLocation("/escrow/create")}>Create Your First Escrow</Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
