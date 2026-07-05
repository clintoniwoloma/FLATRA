import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreateEscrowWizard } from '@/components/CreateEscrowWizard';
import { EscrowProgressTracker } from '@/components/EscrowProgressTracker';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  Search,
  Plus,
  ChevronRight,
  Loader2,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500 text-white',
  created: 'bg-blue-500 text-white',
  funded: 'bg-indigo-500 text-white',
  accepted: 'bg-purple-500 text-white',
  delivered: 'bg-yellow-500 text-white',
  released: 'bg-green-500 text-white',
  disputed: 'bg-red-500 text-white',
  cancelled: 'bg-gray-600 text-white',
};

export default function EscrowHub() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('active');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const listEscrowsQuery = trpc.escrow.listEscrows.useQuery(
    { role: 'all', limit: 100 },
    { enabled: !!user }
  );

  const escrows = listEscrowsQuery.data || [];

  const filteredEscrows = escrows.filter((escrow) => {
    const matchesSearch =
      escrow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escrow.id.includes(searchQuery);

    if (selectedTab === 'active') {
      return matchesSearch && !['released', 'cancelled', 'disputed'].includes(escrow.status);
    } else if (selectedTab === 'completed') {
      return matchesSearch && escrow.status === 'released';
    } else if (selectedTab === 'disputes') {
      return matchesSearch && escrow.status === 'disputed';
    }

    return matchesSearch;
  });

  const stats = {
    totalEscrows: escrows.length,
    activeValue: escrows
      .filter((e) => !['released', 'cancelled'].includes(e.status))
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)
      .toFixed(2),
    completedValue: escrows
      .filter((e) => e.status === 'released')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)
      .toFixed(2),
    disputeCount: escrows.filter((e) => e.status === 'disputed').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Escrow Hub</h1>
            <p className="text-muted-foreground mt-2">Manage all your escrow transactions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Escrow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Escrows</p>
                <p className="text-2xl font-bold mt-2">{stats.totalEscrows}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Value</p>
                <p className="text-2xl font-bold mt-2">${stats.activeValue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-2">${stats.completedValue}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disputes</p>
                <p className="text-2xl font-bold mt-2">{stats.disputeCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search escrows by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({escrows.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({escrows.filter((e) => !['released', 'cancelled', 'disputed'].includes(e.status)).length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({escrows.filter((e) => e.status === 'released').length})
            </TabsTrigger>
            <TabsTrigger value="disputes">
              Disputes ({stats.disputeCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {listEscrowsQuery.isLoading ? (
              <Card className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading escrows...</p>
              </Card>
            ) : filteredEscrows.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No escrows found</p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="outline"
                >
                  Create your first escrow
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredEscrows.map((escrow) => (
                  <Card
                    key={escrow.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setLocation(`/escrow/${escrow.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{escrow.title}</h3>
                          <Badge className={STATUS_COLORS[escrow.status]}>
                            {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{escrow.description}</p>
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-semibold">
                              {escrow.amount} {escrow.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-semibold capitalize">
                              {escrow.transactionType?.replace("_", " ") || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-semibold">
                              {new Date(escrow.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-64">
                        <EscrowProgressTracker status={escrow.status as any} />
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Escrow Dialog */}
      <CreateEscrowWizard
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          listEscrowsQuery.refetch();
        }}
      />
    </DashboardLayout>
  );
}

