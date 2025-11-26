import { format } from "date-fns";
import {
  FileText,
  CreditCard,
  CheckCircle2,
  Settings,
  CircleCheck,
  XCircle,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  status: string;
  timestamp?: string;
  description: string;
  actor?: string;
}

interface StatusHistoryItem {
  status: string;
  changedBy?: string;
  changedByName?: string;
  changedAt: string;
  reason?: string;
  notes?: string;
}

interface RequestStatusTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: StatusHistoryItem[];
}

const statusConfig: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  pending: {
    icon: FileText,
    color: "bg-slate-500",
    label: "Request Submitted",
  },
  approved: {
    icon: CheckCircle2,
    color: "bg-blue-500",
    label: "Request Approved",
  },
  payment_pending: {
    icon: CreditCard,
    color: "bg-blue-500",
    label: "Awaiting Payment",
  },
  payment_verified: {
    icon: CheckCircle2,
    color: "bg-sky-500",
    label: "Payment Verified",
  },
  ready_for_generation: {
    icon: Settings,
    color: "bg-green-500",
    label: "Processing Document",
  },
  processing: {
    icon: Settings,
    color: "bg-green-500",
    label: "Processing Document",
  },
  completed: {
    icon: CircleCheck,
    color: "bg-emerald-600",
    label: "Completed",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-orange-500",
    label: "Request Cancelled",
  },
  rejected: {
    icon: XCircle,
    color: "bg-red-500",
    label: "Request Rejected",
  },
};

export function RequestStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
  statusHistory,
}: RequestStatusTimelineProps) {
  // Build comprehensive timeline from status history
  const timelineEvents: TimelineEvent[] =
    statusHistory && statusHistory.length > 0
      ? statusHistory.map((history) => {
          // Map status to proper labels and descriptions
          let description = "";

          // Provide user-friendly default descriptions based on status
          switch (history.status) {
            case "pending":
              description =
                "Your request has been submitted and is awaiting review";
              break;
            case "approved":
              description = "Your request has been approved by staff";
              break;
            case "payment_pending":
              description = "Please complete the payment to proceed";
              break;
            case "payment_verified":
              description = "Your payment has been verified";
              break;
            case "ready_for_generation":
              description =
                "Your document is being processed and will be ready soon";
              break;
            case "processing":
              description =
                "Your document is being processed and will be ready soon";
              break;
            case "completed":
              description = "Your document is ready for pickup or download";
              break;
            case "rejected":
              description =
                history.reason || "Your request has been rejected";
              break;
            case "cancelled":
              description = "This request has been cancelled";
              break;
            default:
              description = `Status changed to ${history.status.replace(/_/g, " ")}`;
          }
          
          // For rejected status, show reason if available
          // For other statuses, only add notes as additional context if they're meaningful
          if (history.status === "rejected" && history.reason) {
            description = history.reason;
          }

          return {
            status: history.status,
            timestamp: history.changedAt, // Use changedAt from backend
            description: description,
            actor: history.changedByName, // Use changedByName from backend
          };
        })
      : [
          {
            status: currentStatus,
            timestamp: updatedAt,
            description: `Your request is currently ${currentStatus.replace(/_/g, " ")}`,
          },
          {
            status: "pending",
            timestamp: createdAt,
            description: "Your request has been submitted successfully",
          },
        ];

  // Sort by timestamp descending (newest first)
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Request Timeline</h3>

      <div className="relative space-y-6">
        {sortedEvents.map((event, index) => {
          const config = statusConfig[event.status] || {
            icon: Circle,
            color: "bg-gray-500",
            label: event.status,
          };
          const Icon = config.icon;
          const isLast = index === sortedEvents.length - 1;

          return (
            <div key={index} className="relative flex gap-4">
              {/* Timeline line */}
              {!isLast && (
                <div className="bg-border absolute top-12 left-5 h-full w-0.5" />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  config.color,
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium capitalize">{config.label}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {event.description}
                    </p>
                    {event.actor && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        By: {event.actor}
                      </p>
                    )}
                  </div>
                  {event.timestamp && (
                    <time className="text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(event.timestamp), "MMM dd, yyyy")}
                      <br />
                      {format(new Date(event.timestamp), "h:mm a")}
                    </time>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
