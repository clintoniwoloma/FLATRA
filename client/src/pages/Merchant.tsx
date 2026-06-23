import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Link as LinkIcon, Copy, Eye } from "lucide-react";

export default function Merchant() {
  const [, setLocation] = useLocation();
  const [isMerchant] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "Tech Store",
    businessEmail: "store@techstore.com",
    businessPhone: "+1 (555) 987-6543",
    businessDescription: "Premium electronics and gadgets retailer",
    businessWebsite: "https://techstore.com",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Save merchant profile to backend
      console.log("Saving merchant profile:", formData);
    } catch (error) {
      console.error("Failed to save merchant profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock payment links data
  const paymentLinks = [
    {
      id: "pl_001",
      name: "Product Purchase - iPhone 15",
      amount: 999,
      currency: "USD",
      url: "https://flatra.app/pay/pl_001",
      views: 245,
      conversions: 12,
      status: "active",
      createdAt: "2026-06-15",
    },
    {
      id: "pl_002",
      name: "Service Fee - Consulting",
      amount: 500,
      currency: "USD",
      url: "https://flatra.app/pay/pl_002",
      views: 89,
      conversions: 3,
      status: "active",
      createdAt: "2026-06-10",
    },
    {
      id: "pl_003",
      name: "Subscription - Monthly Plan",
      amount: 29.99,
      currency: "USD",
      url: "https://flatra.app/pay/pl_003",
      views: 156,
      conversions: 8,
      status: "active",
      createdAt: "2026-06-05",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your business and payment links</p>
          </div>
          {isMerchant && (
            <Button onClick={() => setLocation("/merchant/payment-link/create")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Payment Link
            </Button>
          )}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
            <TabsTrigger value="links">Payment Links</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your business name"
                  />
                </div>

                {/* Business Email */}
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    placeholder="business@example.com"
                  />
                </div>

                {/* Business Phone */}
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Business Website */}
                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Business Website</Label>
                  <Input
                    id="businessWebsite"
                    name="businessWebsite"
                    type="url"
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Business Description */}
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your business..."
                    rows={4}
                  />
                </div>

                {/* Save Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* Payment Links Tab */}
          <TabsContent value="links" className="space-y-6 mt-6">
            {paymentLinks.length > 0 ? (
              <div className="space-y-4">
                {paymentLinks.map((link) => (
                  <Card key={link.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{link.name}</h3>
                          <Badge variant="default" className="capitalize">
                            {link.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Created on {new Date(link.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {link.currency} {link.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4 py-4 border-y border-border/40">
                      <div>
                        <p className="text-muted-foreground text-sm">Views</p>
                        <p className="text-lg font-semibold">{link.views}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Conversions</p>
                        <p className="text-lg font-semibold">{link.conversions}</p>
                      </div>
                    </div>

                    {/* Link and Actions */}
                    <div className="flex items-center gap-2 mb-4">
                      <Input
                        value={link.url}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigator.clipboard.writeText(link.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No payment links yet</p>
                <Button onClick={() => setLocation("/merchant/payment-link/create")}>
                  Create Your First Payment Link
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
