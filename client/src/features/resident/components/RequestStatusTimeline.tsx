import { format } from "date-fns";
import { 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Settings, 
  PackageCheck, 
  CircleCheck,
  XCircle,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  status: string;
  timestamp?: string;
  description: string;
  actor?: string;
}

interface RequestStatusTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: TimelineEvent[];
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { 
    icon: FileText, 
    color: "bg-slate-500", 
    label: "Request Submitted" 
  },
  approved: {
    icon: CheckCircle2,
    color: "bg-blue-500",
    label: "Request Approved"
  },
  payment_pending: { 
    icon: CreditCard, 
    color: "bg-blue-500", 
    label: "Awaiting Payment" 
  },
  payment_verified: { 
    icon: CheckCircle2, 
    color: "bg-sky-500", 
    label: "Payment Verified" 
  },
  ready_for_generation: { 
    icon: Settings, 
    color: "bg-green-500", 
    label: "Processing Document" 
  },
  completed: { 
    icon: CircleCheck, 
    color: "bg-emerald-600", 
    label: "Completed" 
  },
  cancelled: { 
    icon: XCircle, 
    color: "bg-orange-500", 
    label: "Request Cancelled" 
  },
  rejected: { 
    icon: XCircle, 
    color: "bg-red-500", 
    label: "Request Rejected" 
  },
};

export function RequestStatusTimeline({ 
  currentStatus, 
  createdAt, 
  updatedAt,
  statusHistory 
}: RequestStatusTimelineProps) {
  // Build timeline from status history or create a simple one
  const timelineEvents: TimelineEvent[] = statusHistory || [
    {
      status: currentStatus,
      timestamp: updatedAt,
      description: `Your request is currently ${currentStatus.toLowerCase()}`,
    },
    {
      status: "Submitted",
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
      <h3 className="font-semibold text-lg">Request Timeline</h3>
      
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
                <div className="absolute left-5 top-12 h-full w-0.5 bg-border" />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  config.color
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{config.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    {event.actor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        By: {event.actor}
                      </p>
                    )}
                  </div>
                  {event.timestamp && (
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
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
