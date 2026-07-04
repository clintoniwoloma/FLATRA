import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type EscrowStatus = "draft" | "created" | "funded" | "accepted" | "delivered" | "released" | "disputed" | "cancelled";

interface EscrowProgressTrackerProps {
  status: EscrowStatus;
  className?: string;
}

const PROGRESS_STEPS = [
  { key: "created", label: "Escrow Created", icon: "circle" },
  { key: "funded", label: "Escrow Funded", icon: "circle" },
  { key: "accepted", label: "Seller Accepted", icon: "circle" },
  { key: "delivered", label: "Delivery Submitted", icon: "circle" },
  { key: "released", label: "Funds Released", icon: "circle" },
];

const STATUS_COLORS: Record<EscrowStatus, string> = {
  draft: "bg-gray-200",
  created: "bg-blue-200",
  funded: "bg-blue-400",
  accepted: "bg-indigo-400",
  delivered: "bg-purple-400",
  released: "bg-green-500",
  disputed: "bg-red-500",
  cancelled: "bg-gray-400",
};

const STATUS_LABELS: Record<EscrowStatus, string> = {
  draft: "Draft",
  created: "Created",
  funded: "Funded",
  accepted: "Accepted",
  delivered: "Delivered",
  released: "Released",
  disputed: "Disputed",
  cancelled: "Cancelled",
};

export function EscrowProgressTracker({ status, className }: EscrowProgressTrackerProps) {
  const getStepIndex = (stepKey: string) => {
    return PROGRESS_STEPS.findIndex((step) => step.key === stepKey);
  };

  const currentStepIndex = getStepIndex(status);
  const isCompleted = (stepKey: string) => {
    return getStepIndex(stepKey) <= currentStepIndex && !["disputed", "cancelled"].includes(status);
  };

  if (status === "disputed" || status === "cancelled") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className={cn("px-4 py-2 rounded-lg font-medium text-white", STATUS_COLORS[status])}>
          {STATUS_LABELS[status]}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {PROGRESS_STEPS.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                isCompleted(step.key)
                  ? cn("bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg")
                  : index === currentStepIndex
                    ? cn("bg-blue-400 text-white ring-2 ring-blue-200 shadow-md")
                    : "bg-gray-200 text-gray-400"
              )}
            >
              {isCompleted(step.key) ? (
                <Check className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>

            {/* Step Label */}
            <span
              className={cn(
                "text-xs text-center font-medium transition-colors",
                isCompleted(step.key) || index === currentStepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{
            width: `${((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100}%`,
          }}
        />
      </div>

      {/* Current Status */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground">
          {STATUS_LABELS[status]}
        </p>
        <p className="text-xs text-muted-foreground">
          {currentStepIndex + 1} of {PROGRESS_STEPS.length} steps
        </p>
      </div>
    </div>
  );
}
