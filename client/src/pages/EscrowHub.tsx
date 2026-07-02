import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';

export default function EscrowHub() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('active');

  const escrowData = {
    active: [
      {
        id: 'ESC-001',
        title: 'Laptop Purchase',
        counterparty: 'Alice Johnson',
        amount: '$1,200',
        status: 'funded',
        progress: 60,
        daysLeft: 3,
      },
      {
        id: 'ESC-002',
        title: 'Freelance Project',
        counterparty: 'Bob Smith',
        amount: '$500',
        status: 'in_progress',
        progress: 40,
        daysLeft: 5,
      },
    ],
    pending: [
      {
        id: 'ESC-003',
        title: 'Graphic Design Work',
        counterparty: 'Carol White',
        amount: '$300',
        status: 'pending',
        progress: 0,
        daysLeft: 7,
      },
      {
        id: 'ESC-004',
        title: 'Website Development',
        counterparty: 'David Brown',
        amount: '$2,000',
        status: 'pending',
        progress: 0,
        daysLeft: 10,
      },
    ],
    completed: [
      {
        id: 'ESC-005',
        title: 'Camera Equipment',
        counterparty: 'Eve Davis',
        amount: '$800',
        status: 'released',
        progress: 100,
        completedDate: '2 days ago',
      },
      {
        id: 'ESC-006',
        title: 'Consulting Services',
        counterparty: 'Frank Miller',
        amount: '$1,500',
        status: 'released',
        progress: 100,
        completedDate: '1 week ago',
      },
    ],
    disputes: [
      {
        id: 'ESC-007',
        title: 'Product Quality Issue',
        counterparty: 'Grace Lee',
        amount: '$400',
        status: 'disputed',
        progress: 50,
        daysLeft: 2,
      },
    ],
  };

  const stats = {
    totalEscrows: 7,
    activeValue: '$1,700',
    completedValue: '$2,300',
    disputeCount: 1,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      funded: { label: 'Funded', variant: 'default' },
      in_progress: { label: 'In Progress', variant: 'default' },
      released: { label: 'Released', variant: 'outline' },
      disputed: { label: 'Disputed', variant: 'destructive' },
      cancelled: { label: 'Cancelled', variant: 'outline' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const EscrowCard = ({ escrow, showDaysLeft = true }: any) => (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setLocation(`/escrow/${escrow.id}`)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{escrow.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{escrow.counterparty}</p>
          </div>
          {getStatusBadge(escrow.status)}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{escrow.amount}</span>
          <span className="text-sm text-muted-foreground">ID: {escrow.id}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{escrow.progress}%</span>
          </div>
          <Progress value={escrow.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          {showDaysLeft ? (
            <>
              <span className="text-xs text-muted-foreground">{escrow.daysLeft} days left</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">
                Completed {escrow.completedDate}
              </span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Escrow Hub</h1>
            <p className="text-muted-foreground mt-2">Manage all your escrow transactions</p>
          </div>
          <Button onClick={() => setLocation('/create-escrow')} size="lg">
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
                <p className="text-2xl font-bold mt-2">{stats.activeValue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-2">{stats.completedValue}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
            placeholder="Search escrows by title or counterparty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active (2)</TabsTrigger>
            <TabsTrigger value="pending">Pending (2)</TabsTrigger>
            <TabsTrigger value="completed">Completed (2)</TabsTrigger>
            <TabsTrigger value="disputes">Disputes (1)</TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {escrowData.active.map((escrow) => (
                <EscrowCard key={escrow.id} escrow={escrow} />
              ))}
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {escrowData.pending.map((escrow) => (
                <EscrowCard key={escrow.id} escrow={escrow} />
              ))}
            </div>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {escrowData.completed.map((escrow) => (
                <EscrowCard key={escrow.id} escrow={escrow} showDaysLeft={false} />
              ))}
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {escrowData.disputes.map((escrow) => (
                <EscrowCard key={escrow.id} escrow={escrow} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
