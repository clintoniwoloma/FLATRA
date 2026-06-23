import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateEscrow() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    counterpartyEmail: "",
    amount: "",
    currency: "USD",
    inspectionPeriodDays: "3",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Submit escrow creation to backend
      console.log("Creating escrow:", formData);
      // After successful creation, redirect to escrow hub
      setLocation("/escrow");
    } catch (error) {
      console.error("Failed to create escrow:", error);
    } finally {
      setIsLoading(false);
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
            onClick={() => setLocation("/escrow")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Escrow</h1>
            <p className="text-muted-foreground mt-2">Set up a new secure transaction</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Escrow Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Laptop Purchase"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">A brief title for this transaction</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this escrow is for..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Optional: Provide details about the transaction</p>
            </div>

            {/* Counterparty Email */}
            <div className="space-y-2">
              <Label htmlFor="counterpartyEmail">Counterparty Email</Label>
              <Input
                id="counterpartyEmail"
                name="counterpartyEmail"
                type="email"
                placeholder="seller@example.com"
                value={formData.counterpartyEmail}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">The other party's email address</p>
            </div>

            {/* Amount and Currency */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="1000.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inspection Period */}
            <div className="space-y-2">
              <Label htmlFor="inspectionPeriodDays">Inspection Period (Days)</Label>
              <Select
                value={formData.inspectionPeriodDays}
                onValueChange={(value) => handleSelectChange("inspectionPeriodDays", value)}
              >
                <SelectTrigger id="inspectionPeriodDays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Time for the buyer to inspect and approve the transaction
              </p>
            </div>

            {/* Info Box */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold">How it works:</span> Once created, your counterparty will receive an invitation to join this escrow. Funds will be held securely until both parties confirm the transaction is complete.
              </p>
            </Card>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/escrow")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Escrow"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
