import React from "react";
import { Check, Clock, FileText, Package, type LucideIcon } from "lucide-react";
import { StatCard } from "./StatCard";

export interface DashboardStat {
  title: string;
  count: number;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatsGridProps {
  isVerified: boolean;
  onStatClick?: (stat: DashboardStat, index: number) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  isVerified,
  onStatClick,
}) => {
  const fgValue = 400;
  const bgValue = 1;

  const dashboardStats: DashboardStat[] = [
    {
      title: "Total Requests",
      count: 12,
      description: "All submitted requests",
      icon: FileText,
      color: `text-blue-600 dark:text-blue-${fgValue}`,
      bgColor: `bg-blue-50 dark:bg-blue-${bgValue}`,
    },
    {
      title: "Action Required",
      count: 3,
      description: "Requests needing your action",
      icon: Clock,
      color: `text-orange-600 dark:text-orange-${fgValue}`,
      bgColor: `bg-orange-50 dark:bg-orange-${bgValue}`,
    },
    {
      title: "Ready for Pickup",
      count: 2,
      description: "Documents ready to collect",
      icon: Package,
      color: `text-green-600 dark:text-green-${fgValue}`,
      bgColor: `bg-green-50 dark:bg-green-${bgValue}`,
    },
    {
      title: "Completed",
      count: 7,
      description: "Successfully processed",
      icon: Check,
      color: `text-emerald-600 dark:text-emerald-${fgValue}`,
      bgColor: `bg-emerald-50 dark:bg-emerald-${bgValue}`,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardStats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          isLocked={!isVerified}
          onClick={() => onStatClick?.(stat, index)}
        />
      ))}
    </div>
  );
};
