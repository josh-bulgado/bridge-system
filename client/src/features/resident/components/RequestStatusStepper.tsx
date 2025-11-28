import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface Step {
  label: string;
  status: "completed" | "current" | "pending" | "cancelled" | "rejected";
}

interface RequestStatusStepperProps {
  currentStatus: string;
  documentFormat?: "hardcopy" | "softcopy";
}

const statusOrder = [
  "pending",
  "approved",
  "payment_verified",
  "ready_for_generation",
  "processing",
  "ready_for_pickup",
  "completed",
];

const getStatusLabel = (status: string, documentFormat?: "hardcopy" | "softcopy"): string => {
  const isSoftCopy = documentFormat === "softcopy";
  
  const baseLabels: Record<string, string> = {
    pending: "Submitted",
    approved: "Approved",
    payment_pending: "Payment Pending",
    payment_verified: "Payment Verified",
    ready_for_generation: "Ready for Generation",
    processing: "Processing",
    ready_for_pickup: isSoftCopy ? "Ready for Download" : "Ready for Pickup",
    completed: "Completed",
  };
  
  return baseLabels[status] || status;
};

export function RequestStatusStepper({
  currentStatus,
  documentFormat,
}: RequestStatusStepperProps) {
  // Handle cancelled and rejected states
  if (currentStatus === "cancelled" || currentStatus === "rejected") {
    return (
      <div className="bg-muted/50 flex items-center justify-center rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              currentStatus === "cancelled" ? "bg-orange-500" : "bg-red-500",
            )}
          >
            <X className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold">Request {currentStatus}</p>
            <p className="text-muted-foreground text-sm">
              This request is no longer active
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(currentStatus);

  const steps: Step[] = statusOrder.map((status, index) => {
    let stepStatus: Step["status"] = "pending";

    if (index < currentIndex) {
      stepStatus = "completed";
    } else if (index === currentIndex) {
      stepStatus = "current";
    }

    return {
      label: getStatusLabel(status, documentFormat),
      status: stepStatus,
    };
  });

  return (
    <div className="w-full">
      {/* Desktop: Horizontal Stepper */}
      <div className="hidden md:block w-full">
        <div className="flex items-start w-full">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    step.status === "completed" &&
                      "border-green-500 bg-green-500 text-white",
                    step.status === "current" &&
                      "border-green-500 bg-green-500 text-white animate-pulse",
                    step.status === "pending" &&
                      "border-slate-300 bg-white text-slate-400",
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : step.status === "current" ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-center text-xs font-medium max-w-[80px]",
                    step.status === "completed" && "text-green-600",
                    step.status === "current" && "font-semibold text-green-600",
                    step.status === "pending" && "text-slate-400",
                  )}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-4 mt-5 transition-all",
                    step.status === "completed"
                      ? "bg-green-500"
                      : "bg-slate-200",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Stepper */}
      <div className="space-y-4 md:hidden">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Step Circle */}
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                step.status === "completed" &&
                  "border-green-500 bg-green-500 text-white",
                step.status === "current" &&
                  "animate-pulse border-green-500 bg-green-500 text-white",
                step.status === "pending" &&
                  "border-slate-300 bg-white text-slate-400",
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : step.status === "current" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="flex-1 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.status === "completed" && "text-green-600",
                  step.status === "current" && "font-semibold text-green-600",
                  step.status === "pending" && "text-slate-400",
                )}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line (for mobile) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-4 mt-8 h-8 w-0.5 transition-all",
                  step.status === "completed" ? "bg-green-500" : "bg-slate-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
