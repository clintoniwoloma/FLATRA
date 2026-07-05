import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Copy, Check } from 'lucide-react';

interface SendReceiveFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress?: string;
}

export function SendReceiveFlow({ open, onOpenChange, walletAddress }: SendReceiveFlowProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [sendStep, setSendStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);

  // Send form state
  const [sendData, setSendData] = useState({
    recipientEmail: '',
    amount: '',
    currency: 'USD',
    description: '',
  });

  // Receive form state
  const [receiveData, setReceiveData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
  });

  const handleSendSubmit = () => {
    if (!sendData.recipientEmail || !sendData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSendStep(2);
  };

  const handleSendConfirm = () => {
    toast.success(`Sent ${sendData.amount} ${sendData.currency} to ${sendData.recipientEmail}`);
    setSendStep(3);
    setTimeout(() => {
      onOpenChange(false);
      setSendStep(1);
      setSendData({ recipientEmail: '', amount: '', currency: 'USD', description: '' });
    }, 2000);
  };

  const handleReceiveSubmit = () => {
    if (!receiveData.amount) {
      toast.error('Please enter an amount');
      return;
    }
    toast.success(`Request for ${receiveData.amount} ${receiveData.currency} created`);
    onOpenChange(false);
    setReceiveData({ amount: '', currency: 'USD', description: '' });
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send & Receive Money</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'send' | 'receive')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">
              <Send className="w-4 h-4 mr-2" />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive">Receive</TabsTrigger>
          </TabsList>

          {/* SEND TAB */}
          <TabsContent value="send" className="space-y-4">
            {sendStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="recipient@example.com"
                    value={sendData.recipientEmail}
                    onChange={(e) => setSendData({ ...sendData, recipientEmail: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={sendData.amount}
                      onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={sendData.currency} onValueChange={(v) => setSendData({ ...sendData, currency: v })}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this payment for?"
                    value={sendData.description}
                    onChange={(e) => setSendData({ ...sendData, description: e.target.value })}
                    className="resize-none"
                  />
                </div>

                <Button onClick={handleSendSubmit} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {sendStep === 2 && (
              <div className="space-y-4">
                <Card className="p-4 bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Review Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span className="font-medium">{sendData.recipientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">
                        {sendData.amount} {sendData.currency}
                      </span>
                    </div>
                    {sendData.description && (
                      <div className="flex justify-between">
                        <span>Note:</span>
                        <span className="font-medium text-sm">{sendData.description}</span>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSendStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleSendConfirm} className="flex-1">
                    Send
                  </Button>
                </div>
              </div>
            )}

            {sendStep === 3 && (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="font-medium mb-2">Payment Sent!</p>
                <p className="text-sm text-muted-foreground">
                  {sendData.amount} {sendData.currency} sent to {sendData.recipientEmail}
                </p>
              </div>
            )}
          </TabsContent>

          {/* RECEIVE TAB */}
          <TabsContent value="receive" className="space-y-4">
            <div>
              <Label htmlFor="receive-amount">Amount (Optional)</Label>
              <Input
                id="receive-amount"
                type="number"
                placeholder="0.00"
                value={receiveData.amount}
                onChange={(e) => setReceiveData({ ...receiveData, amount: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="receive-currency">Currency</Label>
              <Select value={receiveData.currency} onValueChange={(v) => setReceiveData({ ...receiveData, currency: v })}>
                <SelectTrigger id="receive-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="receive-description">Description (Optional)</Label>
              <Textarea
                id="receive-description"
                placeholder="What is this payment for?"
                value={receiveData.description}
                onChange={(e) => setReceiveData({ ...receiveData, description: e.target.value })}
                className="resize-none"
              />
            </div>

            {walletAddress && (
              <div className="space-y-2">
                <Label>Your Wallet Address</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-3 py-2 rounded flex-1 truncate">{walletAddress}</code>
                  <Button size="sm" variant="ghost" onClick={handleCopyAddress}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={handleReceiveSubmit} className="w-full">
              Create Request
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
