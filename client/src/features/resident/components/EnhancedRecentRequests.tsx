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
    } else if (statusLower.includes("ready") || statusLower.includes("pickup")) {
      return Package;
    } else if (statusLower.includes("pending")) {
      return Clock;
    }
    return AlertCircle;
  };

  const getStatusColor = (statusColor: string) => {
    // Extract color from the statusColor string
    if (statusColor.includes("green")) return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    if (statusColor.includes("blue")) return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    if (statusColor.includes("yellow")) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    if (statusColor.includes("orange")) return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    if (statusColor.includes("red")) return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    if (statusColor.includes("emerald")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>
              {isVerified
                ? "Track your latest document requests"
                : "Verify your residency to view requests"}
            </CardDescription>
          </div>
          {isVerified && requests.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8">
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!isVerified ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Requests Locked</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
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
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/60 border border-border/40 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="font-semibold mb-2">No Requests Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              You haven't submitted any document requests. Start by requesting
              your first document.
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-border/60"
              onClick={onViewAll}
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Documents
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const statusColorClass = getStatusColor(request.statusColor);

              return (
                <div
                  key={request.id}
                  onClick={() => onRequestClick?.(request)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-all cursor-pointer",
                    "hover:shadow-sm hover:border-primary/50"
                  )}
                >
                  {/* Icon */}
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                      {request.type}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{request.date}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant="secondary"
                    className={cn("flex items-center gap-1 text-xs py-0.5", statusColorClass)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    <span className="hidden sm:inline">{request.status}</span>
                  </Badge>

                  {/* Arrow */}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}

            {/* View All Button at Bottom */}
            {requests.length >= 5 && (
              <Button
                variant="outline"
                className="w-full h-8 mt-2"
                onClick={onViewAll}
              >
                View All Requests
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
