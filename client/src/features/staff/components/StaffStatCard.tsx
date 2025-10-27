import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffStatCardProps {
  title: string;
  count: number;
  change: number;
  theme: 'green' | 'orange' | 'purple' | 'blue';
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

const themeConfig = {
  green: {
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    numberColor: 'text-emerald-600',
  },
  orange: {
    border: 'border-l-orange-500',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    numberColor: 'text-orange-600',
  },
  purple: {
    border: 'border-l-purple-500',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    numberColor: 'text-purple-600',
  },
  blue: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    numberColor: 'text-blue-600',
  },
};

export const StaffStatCard: React.FC<StaffStatCardProps> = ({
  title,
  count,
  change,
  theme,
  icon: IconComponent,
  onClick,
}) => {
  const config = themeConfig[theme];
  const isPositive = change >= 0;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4",
        config.border,
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={cn("text-4xl font-bold mb-2", config.numberColor)}>
              {count.toLocaleString()}
            </p>
            <div className="flex items-center text-sm">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={isPositive ? "text-green-600" : "text-red-600"}>
                {isPositive ? "+" : ""}{change}%
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
          <div className={cn("rounded-full p-4", config.iconBg)}>
            <IconComponent className={cn("h-8 w-8", config.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};