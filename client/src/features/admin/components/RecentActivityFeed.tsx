import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, CreditCard, FileText } from "lucide-react";
import type { RecentActivity } from "../services/adminDashboardService";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

interface RecentActivityFeedProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

export function RecentActivityFeed({
  activities,
  isLoading,
}: RecentActivityFeedProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "approved":
        return (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "verified payment":
        return (
          <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        );
      case "generated document":
        return (
          <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        );
      default:
        return (
          <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
      case "verified payment":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
      case "generated document":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/50 dark:text-gray-400 dark:border-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest staff actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest staff actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-3 h-12 w-12 text-gray-400" />
              <p className="text-muted-foreground text-sm">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b pb-4 last:border-0"
                >
                  <div className="mt-1">{getActionIcon(activity.action)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{activity.staffName}</span>
                      <Badge
                        variant="outline"
                        className={clsx(
                          getActionColor(activity.action),
                          "capitalize",
                        )}
                      >
                        {activity.action}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium">
                        {activity.residentName}
                      </span>{" "}
                      - {activity.documentType}
                    </p>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{activity.trackingNumber}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
