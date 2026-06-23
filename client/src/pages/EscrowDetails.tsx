import { useState } from "react";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, Share2, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface EscrowStatus {
  status: "pending" | "funded" | "in_progress" | "disputed" | "released" | "cancelled";
  timestamp: string;
  description: string;
}

interface Escrow {
  id: string;
  title: string;
  description: string;
  buyer: string;
  seller: string;
  amount: number;
  currency: string;
  inspectionPeriodDays: number;
  status: "pending" | "funded" | "in_progress" | "disputed" | "released" | "cancelled";
  createdAt: string;
  timeline: EscrowStatus[];
  shareableLink: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  funded: "bg-blue-500/10 text-blue-700 border-blue-200",
  in_progress: "bg-purple-500/10 text-purple-700 border-purple-200",
  disputed: "bg-red-500/10 text-red-700 border-red-200",
  released: "bg-green-500/10 text-green-700 border-green-200",
  cancelled: "bg-gray-500/10 text-gray-700 border-gray-200",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-5 h-5" />;
    case "funded":
    case "in_progress":
      return <AlertCircle className="w-5 h-5" />;
    case "released":
      return <CheckCircle2 className="w-5 h-5" />;
    case "disputed":
      return <AlertCircle className="w-5 h-5" />;
    case "cancelled":
      return <XCircle className="w-5 h-5" />;
    default:
      return null;
  }
};

export default function EscrowDetails() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const escrowId = params?.id || "esc_001";
  const [isLoading] = useState(false);

  // Mock escrow data
  const escrow: Escrow = {
    id: escrowId,
    title: "Laptop Purchase",
    description: "Purchase of a Dell XPS 15 laptop in excellent condition",
    buyer: "You (Current User)",
    seller: "John Seller (john@example.com)",
    amount: 1200,
    currency: "USD",
    inspectionPeriodDays: 3,
    status: "funded",
    createdAt: "2026-06-20",
    shareableLink: `https://flatra.app/escrow/${escrowId}/share`,
    timeline: [
      {
        status: "pending",
        timestamp: "2026-06-20 10:30 AM",
        description: "Escrow created and invitation sent to seller",
      },
      {
        status: "funded",
        timestamp: "2026-06-20 02:15 PM",
        description: "Buyer funded the escrow with USD $1,200",
      },
      {
        status: "in_progress",
        timestamp: "2026-06-21 09:00 AM",
        description: "Seller confirmed item shipment",
      },
    ],
  };

  const userRole: "buyer" | "seller" = "buyer";
  const canFund = escrow.status === "pending" && userRole === "buyer";
  const canRelease = escrow.status === "in_progress" && userRole === "buyer";
  const canDispute = ["funded", "in_progress"].includes(escrow.status);
  const canCancel = ["pending", "funded"].includes(escrow.status) && userRole !== "buyer";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/escrow")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{escrow.title}</h1>
            <p className="text-muted-foreground mt-2">Escrow ID: {escrow.id}</p>
          </div>
        </div>

        {/* Main Info Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Amount</p>
              <h2 className="text-4xl font-bold">
                {escrow.currency} {escrow.amount.toLocaleString()}
              </h2>
              <Badge className={`mt-4 capitalize ${statusColors[escrow.status]}`}>
                {escrow.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Buyer</p>
                <p className="font-semibold">{escrow.buyer}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Seller</p>
                <p className="font-semibold">{escrow.seller}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-6">
            <p className="text-muted-foreground text-sm mb-2">Description</p>
            <p className="text-foreground">{escrow.description}</p>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Inspection Period</p>
            <p className="text-2xl font-bold">{escrow.inspectionPeriodDays} days</p>
            <p className="text-xs text-muted-foreground mt-2">Time to inspect and approve</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Created</p>
            <p className="text-lg font-semibold">{escrow.createdAt}</p>
            <p className="text-xs text-muted-foreground mt-2">Transaction start date</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Your Role</p>
            <p className="text-lg font-semibold capitalize">{userRole}</p>
            <p className="text-xs text-muted-foreground mt-2">In this transaction</p>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-8">
          <h3 className="text-lg font-semibold mb-6">Transaction Timeline</h3>
          <div className="space-y-6">
            {escrow.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[event.status]}`}>
                    {getStatusIcon(event.status)}
                  </div>
                  {idx < escrow.timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-border/40 mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="font-semibold capitalize">{event.status.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {canFund && (
            <Button onClick={() => console.log("Fund escrow")}>
              Fund Escrow
            </Button>
          )}
          {canRelease && (
            <Button onClick={() => console.log("Release funds")}>
              Release Funds
            </Button>
          )}
          {canDispute && (
            <Button variant="outline" onClick={() => console.log("Open dispute")}>
              Open Dispute
            </Button>
          )}
          {canCancel && (
            <Button variant="outline" onClick={() => console.log("Cancel escrow")}>
              Cancel Escrow
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Link
          </Button>
        </div>

        {/* Shareable Link */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2">Shareable Link</p>
              <p className="text-xs text-muted-foreground break-all">{escrow.shareableLink}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                navigator.clipboard.writeText(escrow.shareableLink);
              }}
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
