import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: "green" | "orange" | "purple" | "blue" | "amber" | "emerald" | "teal";
  onClick?: () => void;
  className?: string;
}

const colorConfig = {
  green: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    valueBg: "bg-emerald-50/50",
  },
  orange: {
    border: "border-l-orange-500",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    valueBg: "bg-orange-50/50",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    valueBg: "bg-purple-50/50",
  },
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    valueBg: "bg-blue-50/50",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    valueBg: "bg-amber-50/50",
  },
  emerald: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    valueBg: "bg-emerald-50/50",
  },
  teal: {
    border: "border-l-teal-500",
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    valueBg: "bg-teal-50/50",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  onClick,
  className,
}) => {
  const config = colorConfig[color];
  const isPositive = change >= 0;
  const isClickable = Boolean(onClick);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200",
        "border-l-4",
        config.border,
        isClickable && [
          "cursor-pointer",
          "hover:shadow-lg hover:shadow-gray-200/50",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        className,
      )}
      onClick={onClick}
    >
      {/* Background gradient effect on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-200",
          config.valueBg,
          isClickable && "group-hover:opacity-100",
        )}
      />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        {/* Left side - Title and stats */}
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-sm font-medium text-gray-600">
            {title}
          </p>

          {/* Main value */}
          <p className="mb-2 text-4xl leading-none font-bold text-gray-900">
            {value.toLocaleString()}
          </p>

          {/* Change indicator */}
          <div className="flex items-center text-sm">
            {isPositive ? (
              <TrendingUp className="mr-1 h-4 w-4 shrink-0 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4 shrink-0 text-red-500" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="ml-1 truncate text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Right side - Icon */}
        <div
          className={cn(
            "shrink-0 rounded-full p-2 transition-transform duration-200",
            config.iconBg,
            isClickable && "group-hover:scale-110",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center",
              config.iconText,
            )}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Click indicator */}
      {isClickable && (
        <div className="absolute right-2 bottom-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="text-xs font-medium text-gray-400">
            Click to filter
          </div>
        </div>
      )}
    </div>
  );
};
