import React from "react";
import type { LucideIcon } from "lucide-react";
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
  stats: DashboardStat[];
  isVerified: boolean;
  onStatClick?: (stat: DashboardStat, index: number) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  isVerified,
  onStatClick,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
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