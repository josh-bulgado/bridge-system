import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Clock,
  FileText,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

interface RequestCardProps {
  request: {
    id: string;
    trackingNumber: string;
    documentType: string;
    residentName: string;
    purpose: string;
    amount: number;
    status:
      | "pending"
      | "approved"
      | "rejected"
      | "payment_pending"
      | "payment_verified"
      | "ready_for_generation"
      | "completed";
    submittedAt: Date;
    paymentStatus?: "paid" | "unpaid";
  };
  onClick?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
    icon: Check,
  },
  rejected: {
    label: "Rejected",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
    icon: X,
  },
  payment_pending: {
    label: "Payment Pending",
    color:
      "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800",
    icon: CreditCard,
  },
  payment_verified: {
    label: "Payment Verified",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  ready_for_generation: {
    label: "Ready for Generation",
    color:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800",
    icon: FileText,
  },
  completed: {
    label: "Completed",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
    icon: CheckCircle2,
  },
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onClick,
  onApprove,
  onReject,
  className,
}) => {
  const status = statusConfig[request.status] || statusConfig.pending; // Fallback to pending if status not found
  const StatusIcon = status.icon;

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  // Check if actions should be shown
  const showApproveReject =
    request.status === "pending" && onApprove && onReject;
  const isPaid = request.paymentStatus === "paid";

  return (
    <Card
      className={cn(
        "group transition-all duration-200 border-muted/50",
        "hover:shadow-md hover:border-primary/30",
        onClick && "cursor-pointer active:scale-[0.98]",
        className,
      )}
      onClick={() => onClick?.(request.id)}
    >
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Header with Document Type and Status */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {request.documentType}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {isPaid && (
                <Badge className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400 text-xs font-medium px-2 py-0.5">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  PAID
                </Badge>
              )}
              <Badge className={cn("border text-xs font-medium px-2.5 py-0.5", status.color)}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Tracking Number
              </p>
              <p className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                {request.trackingNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Resident
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {request.residentName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Purpose
              </p>
              <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                {request.purpose}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Amount
              </p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                {formatCurrency(request.amount)}
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center text-xs text-muted-foreground pt-1 border-t border-muted/50">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Submitted {getRelativeTime(request.submittedAt)}
          </div>
        </div>

        {/* Actions (only show if approve/reject needed) */}
        {showApproveReject && (
          <div className="flex gap-2 pt-4 border-t border-muted/50 mt-4">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onApprove!(request.id);
              }}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <Check className="mr-1.5 h-4 w-4" />
              Approve
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onReject!(request.id);
              }}
              className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/50"
            >
              <X className="mr-1.5 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
