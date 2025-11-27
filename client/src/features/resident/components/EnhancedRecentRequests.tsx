import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Lock,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestData } from "./RequestItem";

interface EnhancedRecentRequestsProps {
  isVerified: boolean;
  requests: RequestData[];
  isLoading?: boolean;
  onRequestClick?: (request: RequestData) => void;
  onViewAll?: () => void;
}

export const EnhancedRecentRequests: React.FC<EnhancedRecentRequestsProps> = ({
  isVerified,
  requests,
  isLoading = false,
  onRequestClick,
  onViewAll,
}) => {
  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("completed")) {
      return CheckCircle;
    } else if (statusLower.includes("rejected")) {
      return XCircle;
    } else if (
      statusLower.includes("ready") ||
      statusLower.includes("pickup")
    ) {
      return Package;
    } else if (statusLower.includes("pending")) {
      return Clock;
    }
    return AlertCircle;
  };

  const getStatusColor = (statusColor: string) => {
    // Extract color from the statusColor string
    if (statusColor.includes("green"))
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    if (statusColor.includes("blue"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    if (statusColor.includes("yellow"))
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    if (statusColor.includes("orange"))
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    if (statusColor.includes("red"))
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    if (statusColor.includes("emerald"))
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Requests</CardTitle>
            <CardDescription className="mt-1">
              {isVerified
                ? "Track your latest document requests"
                : "Verify your residency to view requests"}
            </CardDescription>
          </div>
          {isVerified && requests.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!isVerified ? (
          <div className="py-12 text-center">
            <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Lock className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 font-semibold">Requests Locked</h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              Complete your residency verification to submit and track document
              requests
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 font-semibold">No Requests Yet</h3>
            <p className="text-muted-foreground mx-auto mb-4 max-w-sm text-sm">
              You haven't submitted any document requests. Start by requesting
              your first document.
            </p>
            <Button size="sm" variant="outline" onClick={onViewAll}>
              <FileText className="mr-2 h-4 w-4" />
              Browse Documents
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const statusColorClass = getStatusColor(request.statusColor);

              return (
                <div
                  key={request.id}
                  onClick={() => onRequestClick?.(request)}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                    "hover:border-green-500 dark:hover:border-green-500",
                  )}
                >
                  {/* Icon */}
                  <div className="rounded-lg bg-green-100 p-2.5 dark:bg-green-950">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 truncate text-base font-semibold">
                      {request.type}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {request.trackingNumber && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-medium text-green-600 dark:text-green-400">
                            #{request.trackingNumber}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{request.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "flex items-center gap-1.5",
                      statusColorClass,
                    )}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{request.status}</span>
                  </Badge>

                  {/* Arrow */}
                  <ArrowRight className="text-muted-foreground h-4 w-4" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
