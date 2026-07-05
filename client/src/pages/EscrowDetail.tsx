import { useState } from 'react';
import { useRoute } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EscrowProgressTracker } from '@/components/EscrowProgressTracker';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Loader2, ArrowLeft, Clock, User, DollarSign, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function EscrowDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/escrow/:id');
  const { user } = useAuth();
  const escrowId = params?.id as string;

  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // Queries
  const getEscrowQuery = trpc.escrow.getEscrow.useQuery({ id: escrowId }, { enabled: !!escrowId });
  const escrow = getEscrowQuery.data;

  // Mutations
  const fundEscrowMutation = trpc.escrow.fundEscrow.useMutation();
  const acceptEscrowMutation = trpc.escrow.acceptEscrow.useMutation();
  const markDeliveredMutation = trpc.escrow.markDelivered.useMutation();
  const releaseEscrowMutation = trpc.escrow.releaseEscrow.useMutation();
  const disputeEscrowMutation = trpc.escrow.disputeEscrow.useMutation();
  const cancelEscrowMutation = trpc.escrow.cancelEscrow.useMutation();

  if (!match) return null;

  if (getEscrowQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!escrow) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Escrow not found</p>
          <Button onClick={() => setLocation('/escrow')} variant="outline">
            Back to Escrows
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const isBuyer = user?.id === escrow.buyerId;
  const isSeller = user?.id === escrow.sellerId;
  const isParticipant = isBuyer || isSeller;

  const handleFund = async () => {
    try {
      await fundEscrowMutation.mutateAsync({ escrowId });
      getEscrowQuery.refetch();
    } catch (error) {
      console.error('Failed to fund escrow:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptEscrowMutation.mutateAsync({ escrowId });
      getEscrowQuery.refetch();
    } catch (error) {
      console.error('Failed to accept escrow:', error);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      await markDeliveredMutation.mutateAsync({ escrowId });
      getEscrowQuery.refetch();
    } catch (error) {
      console.error('Failed to mark delivered:', error);
    }
  };

  const handleRelease = async () => {
    try {
      await releaseEscrowMutation.mutateAsync({ escrowId });
      getEscrowQuery.refetch();
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return;
    try {
      await disputeEscrowMutation.mutateAsync({ escrowId, reason: disputeReason });
      setDisputeDialogOpen(false);
      setDisputeReason('');
      getEscrowQuery.refetch();
    } catch (error) {
      console.error('Failed to open dispute:', error);
    }
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this escrow?')) {
      try {
        await cancelEscrowMutation.mutateAsync({ escrowId });
        setLocation('/escrow');
      } catch (error) {
        console.error('Failed to cancel escrow:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/escrow')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{escrow.title}</h1>
            <p className="text-muted-foreground mt-1">ID: {escrow.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Transaction Progress</h2>
              <EscrowProgressTracker status={escrow.status as any} />
            </Card>

            {/* Details */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">
                    {escrow.amount} {escrow.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {escrow.transactionType?.replace('_', ' ') || 'Unknown'}
                  </p>
                </div>
              </div>

              {escrow.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{escrow.description}</p>
                </div>
              )}

              {escrow.deliveryDeadline && (
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Deadline</p>
                  <p className="mt-1">
                    {new Date(escrow.deliveryDeadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Timeline</h2>
              <div className="space-y-3">
                {escrow.createdAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Escrow Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {escrow.fundedAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Escrow Funded</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.fundedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {escrow.acceptedAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Seller Accepted</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.acceptedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {escrow.deliveredAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Delivery Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {escrow.releasedAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Funds Released</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.releasedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {escrow.disputedAt && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dispute Opened</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(escrow.disputedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Participants</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Buyer</p>
                    <p className="font-medium">
                      {isBuyer ? 'You' : escrow.buyerId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-medium">
                      {isSeller ? 'You' : escrow.sellerId}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Status</h2>
              <Badge className="w-full justify-center py-2 text-base">
                {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
              </Badge>
            </Card>

            {/* Actions */}
            {isParticipant && (
              <Card className="p-6 space-y-3">
                <h2 className="text-lg font-semibold mb-4">Actions</h2>

                {/* Buyer Actions */}
                {isBuyer && escrow.status === 'created' && (
                  <Button
                    onClick={handleFund}
                    disabled={fundEscrowMutation.isPending}
                    className="w-full"
                  >
                    {fundEscrowMutation.isPending ? 'Funding...' : 'Fund Escrow'}
                  </Button>
                )}

                {isBuyer && escrow.status === 'delivered' && (
                  <>
                    <Button
                      onClick={handleRelease}
                      disabled={releaseEscrowMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {releaseEscrowMutation.isPending ? 'Releasing...' : 'Release Funds'}
                    </Button>
                    <Button
                      onClick={() => setDisputeDialogOpen(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Dispute
                    </Button>
                  </>
                )}

                {isBuyer && ['created', 'funded'].includes(escrow.status) && (
                  <Button
                    onClick={handleCancel}
                    variant="destructive"
                    className="w-full"
                  >
                    Cancel Escrow
                  </Button>
                )}

                {/* Seller Actions */}
                {isSeller && escrow.status === 'funded' && (
                  <Button
                    onClick={handleAccept}
                    disabled={acceptEscrowMutation.isPending}
                    className="w-full"
                  >
                    {acceptEscrowMutation.isPending ? 'Accepting...' : 'Accept Escrow'}
                  </Button>
                )}

                {isSeller && escrow.status === 'accepted' && (
                  <Button
                    onClick={handleMarkDelivered}
                    disabled={markDeliveredMutation.isPending}
                    className="w-full"
                  >
                    {markDeliveredMutation.isPending ? 'Submitting...' : 'Mark as Delivered'}
                  </Button>
                )}

                {/* Dispute Action (Both) */}
                {isParticipant && !['released', 'cancelled', 'disputed'].includes(escrow.status) && !isBuyer && (
                  <Button
                    onClick={() => setDisputeDialogOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Open Dispute
                  </Button>
                )}
              </Card>
            )}

            {/* Warning for Disputed */}
            {escrow.status === 'disputed' && (
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Dispute Active</p>
                    <p className="text-sm text-red-800 mt-1">
                      This escrow is currently under dispute. Please contact support for resolution.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dispute Dialog */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Dispute</DialogTitle>
            <DialogDescription>
              Explain why you are opening a dispute for this escrow
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Describe the issue..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDisputeDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDispute}
                disabled={!disputeReason.trim() || disputeEscrowMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {disputeEscrowMutation.isPending ? 'Opening...' : 'Open Dispute'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
