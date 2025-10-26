import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  isLocked?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  description,
  icon: IconComponent,
  color,
  bgColor,
  isLocked = false,
  onClick,
}) => {
  return (
    <Card
      className={`transition-shadow ${
        isLocked 
          ? 'opacity-60 cursor-not-allowed' 
          : 'cursor-pointer hover:shadow-md'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
              {isLocked ? '--' : count}
            </p>
            <p className={`mt-1 text-xs ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
              {isLocked ? 'Verification required' : description}
            </p>
          </div>
          <div className={`rounded-full p-3 ${isLocked ? 'bg-gray-100' : bgColor}`}>
            {isLocked ? (
              <Lock className="h-6 w-6 text-gray-400" />
            ) : (
              <IconComponent className={`h-6 w-6 ${color}`} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};