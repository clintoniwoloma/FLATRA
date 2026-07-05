import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'escrow' | 'payment';
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  from: {
    name: string;
    address: string;
  };
  to: {
    name: string;
    address: string;
  };
  date: Date;
  description?: string;
  fee?: string;
  hash?: string;
  notes?: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const handleCopyHash = () => {
    if (transaction.hash) {
      navigator.clipboard.writeText(transaction.hash);
      toast.success('Transaction hash copied');
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      send: 'Sent',
      receive: 'Received',
      escrow: 'Escrow',
      payment: 'Payment',
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Amount and Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {transaction.type === 'receive' ? '+' : '-'}
                  {transaction.amount}
                </span>
                <span className="text-lg text-muted-foreground">{transaction.currency}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{getTypeLabel(transaction.type)}</p>
            </div>
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>

          {/* From/To Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">From</p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium text-sm">{transaction.from.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                    {transaction.from.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyAddress(transaction.from.address)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">To</p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium text-sm">{transaction.to.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                    {transaction.to.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyAddress(transaction.to.address)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium">{transaction.date.toLocaleString()}</p>
            </div>
            {transaction.fee && (
              <div>
                <p className="text-muted-foreground">Network Fee</p>
                <p className="font-medium">{transaction.fee} {transaction.currency}</p>
              </div>
            )}
          </div>

          {/* Description/Notes */}
          {(transaction.description || transaction.notes) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {transaction.description ? 'Description' : 'Notes'}
              </p>
              <p className="text-sm">{transaction.description || transaction.notes}</p>
            </div>
          )}

          {/* Transaction Hash */}
          {transaction.hash && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-3 py-2 rounded flex-1 truncate">
                  {transaction.hash}
                </code>
                <Button size="sm" variant="ghost" onClick={handleCopyHash}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={() => toast.info('Download feature coming soon')}>
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => toast.info('Share feature coming soon')}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
