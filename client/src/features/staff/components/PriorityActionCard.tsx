import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityActionCardProps {
  title: string;
  count: number;
  theme: 'purple' | 'blue';
  icon: React.ComponentType<{ className?: string }>;
  buttonText: string;
  onClick?: () => void;
}

const themeConfig = {
  purple: {
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconBg: 'bg-purple-400/20',
    buttonBg: 'bg-white/20 hover:bg-white/30',
    buttonText: 'text-white',
  },
  blue: {
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconBg: 'bg-blue-400/20',
    buttonBg: 'bg-white/20 hover:bg-white/30',
    buttonText: 'text-white',
  },
};

export const PriorityActionCard: React.FC<PriorityActionCardProps> = ({
  title,
  count,
  theme,
  icon: IconComponent,
  buttonText,
  onClick,
}) => {
  const config = themeConfig[theme];

  return (
    <Card className={cn("text-white overflow-hidden", config.gradient)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white/80 text-lg">
              <span className="text-3xl font-bold">{count}</span> pending
            </p>
          </div>
          <div className={cn("rounded-full p-4", config.iconBg)}>
            <IconComponent className="h-16 w-16 text-white" />
          </div>
        </div>
        <Button
          onClick={onClick}
          className={cn(
            "w-full border-white/20 hover:border-white/30",
            config.buttonBg,
            config.buttonText
          )}
          variant="outline"
        >
          {buttonText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};