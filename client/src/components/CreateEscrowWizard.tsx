import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";

interface CreateEscrowWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (escrowId: string) => void;
}

type Step = "details" | "participants" | "review" | "confirm";

interface FormData {
  title: string;
  description: string;
  transactionType: "products" | "services" | "freelance" | "digital_goods";
  amount: string;
  currency: string;
  deliveryDeadlineDays: number;
  sellerEmail: string;
}

export function CreateEscrowWizard({ open, onOpenChange, onSuccess }: CreateEscrowWizardProps) {
  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    transactionType: "products",
    amount: "",
    currency: "USD",
    deliveryDeadlineDays: 7,
    sellerEmail: "",
  });
  const { toast } = { toast: (props: any) => console.log(props) }; // Using sonner toast
  const createEscrowMutation = trpc.escrow.createEscrow.useMutation();

  const handleNext = () => {
    if (step === "details") {
      if (!formData.title || !formData.amount) {
      console.warn("Missing fields: title and amount");
        return;
      }
      setStep("participants");
    } else if (step === "participants") {
      if (!formData.sellerEmail) {
      console.warn("Missing field: seller email");
        return;
      }
      setStep("review");
    } else if (step === "review") {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "participants") setStep("details");
    else if (step === "review") setStep("participants");
    else if (step === "confirm") setStep("review");
  };

  const handleCreate = async () => {
    try {
      const result = await createEscrowMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        sellerEmail: formData.sellerEmail,
        amount: formData.amount,
        currency: formData.currency,
        transactionType: formData.transactionType,
        deliveryDeadlineDays: formData.deliveryDeadlineDays,
      });

      console.log("Escrow created successfully");

      onSuccess?.(result.id);
      onOpenChange(false);
      setStep("details");
      setFormData({
        title: "",
        description: "",
        transactionType: "products",
        amount: "",
        currency: "USD",
        deliveryDeadlineDays: 7,
        sellerEmail: "",
      });
    } catch (error: any) {
      console.error("Failed to create escrow:", error.message || error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("details");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Escrow</DialogTitle>
          <DialogDescription>
            {step === "details" && "Step 1 of 3: Transaction Details"}
            {step === "participants" && "Step 2 of 3: Participants"}
            {step === "review" && "Step 3 of 3: Review"}
            {step === "confirm" && "Confirming..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Transaction Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Web Design Project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the transaction details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select value={formData.transactionType} onValueChange={(value: any) => setFormData({ ...formData, transactionType: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="freelance">Freelance Work</SelectItem>
                      <SelectItem value="digital_goods">Digital Goods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deadline">Delivery Deadline (days)</Label>
                  <Input
                    id="deadline"
                    type="number"
                    min="1"
                    value={formData.deliveryDeadlineDays}
                    onChange={(e) => setFormData({ ...formData, deliveryDeadlineDays: parseInt(e.target.value) || 7 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="NGN">NGN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Participants */}
          {step === "participants" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="seller-email">Seller Email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  placeholder="seller@example.com"
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                />
              </div>

              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  The seller will receive an invitation to accept this escrow. They must be a registered FLATRA user.
                </p>
              </Card>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="space-y-4">
              <Card className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{formData.transactionType.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {formData.amount} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="font-medium">{formData.sellerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Deadline:</span>
                  <span className="font-medium">{formData.deliveryDeadlineDays} days</span>
                </div>
                {formData.description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="font-medium text-right">{formData.description}</span>
                  </div>
                )}
              </Card>

              <Card className="p-4 bg-accent/10 border-accent/20">
                <p className="text-sm text-accent-foreground">
                  By creating this escrow, you agree to FLATRA's escrow terms and conditions. The funds will be held securely until the transaction is completed.
                </p>
              </Card>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner className="h-8 w-8 mb-4" />
              <p className="text-muted-foreground">Creating your escrow...</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === "details" || createEscrowMutation.isPending}
            >
              Back
            </Button>

            {step === "review" ? (
              <Button
                onClick={handleCreate}
                disabled={createEscrowMutation.isPending}
                className="flex-1"
              >
                {createEscrowMutation.isPending ? "Creating..." : "Create Escrow"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={createEscrowMutation.isPending}
                className="flex-1"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
