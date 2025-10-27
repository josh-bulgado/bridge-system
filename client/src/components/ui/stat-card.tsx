import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: 'green' | 'orange' | 'purple' | 'blue';
  onClick?: () => void;
  className?: string;
}

const colorConfig = {
  green: {
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    valueBg: 'bg-emerald-50/50',
  },
  orange: {
    border: 'border-l-orange-500',
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-600',
    valueBg: 'bg-orange-50/50',
  },
  purple: {
    border: 'border-l-purple-500',
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    valueBg: 'bg-purple-50/50',
  },
  blue: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    valueBg: 'bg-blue-50/50',
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
        className
      )}
      onClick={onClick}
    >
      {/* Background gradient effect on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-200",
        config.valueBg,
        isClickable && "group-hover:opacity-100"
      )} />
      
      {/* Content */}
      <div className="relative flex items-start justify-between">
        {/* Left side - Title and stats */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">
            {title}
          </p>
          
          {/* Main value */}
          <p className="text-4xl font-bold text-gray-900 mb-2 leading-none">
            {value.toLocaleString()}
          </p>
          
          {/* Change indicator */}
          <div className="flex items-center text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
            )}
            <span className={cn(
              "font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? "+" : ""}{change.toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-1 truncate">vs last month</span>
          </div>
        </div>
        
        {/* Right side - Icon */}
        <div className={cn(
          "flex-shrink-0 rounded-full p-2 transition-transform duration-200",
          config.iconBg,
          isClickable && "group-hover:scale-110"
        )}>
          <div className={cn("h-8 w-8 flex items-center justify-center", config.iconText)}>
            {icon}
          </div>
        </div>
      </div>
      
      {/* Click indicator */}
      {isClickable && (
        <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="text-xs text-gray-400 font-medium">Click to filter</div>
        </div>
      )}
    </div>
  );
};