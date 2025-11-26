import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Package,
  CheckCircle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useResidentStats } from "../hooks/useResidentStats";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const EnhancedStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer group",
        "border-border/60 hover:border-primary/50",
        "bg-card shadow-sm"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp
                    className={cn(
                      "h-3 w-3",
                      trend.isPositive ? "text-green-600" : "text-red-600 rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>

          {/* Icon */}
          <div
            className={cn(
              "rounded-lg p-2 transition-transform group-hover:scale-110",
              iconBgColor
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface EnhancedStatsGridProps {
  isVerified: boolean;
  onStatClick?: (index: number) => void;
}

export const EnhancedStatsGrid: React.FC<EnhancedStatsGridProps> = ({
  isVerified,
  onStatClick,
}) => {
  const { data: user } = useAuth();
  const {
    totalRequests,
    actionRequired,
    readyForPickup,
    completed,
    isLoading,
  } = useResidentStats(user?.id);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!isVerified) {
    return null;
  }

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests,
      description: "All time submissions",
      icon: FileText,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Action Required",
      value: actionRequired,
      description: "Needs your attention",
      icon: Clock,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      title: "Ready for Pickup",
      value: readyForPickup,
      description: "Documents available",
      icon: Package,
      iconColor: "text-green-600 dark:text-green-400",
      iconBgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Completed",
      value: completed,
      description: "Successfully delivered",
      icon: CheckCircle,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBgColor: "bg-emerald-100 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <EnhancedStatCard
          key={index}
          {...stat}
          onClick={() => onStatClick?.(index)}
        />
      ))}
    </div>
  );
};
