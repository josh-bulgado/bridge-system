import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: "green" | "emerald" | "teal" | "cyan" | "lime" | "amber";
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  color = "green",
  onClick,
}: StatCardProps) {
  const colorClasses = {
    green: "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
    lime: "bg-lime-50 text-lime-600 dark:bg-lime-950/50 dark:text-lime-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3.5 w-3.5" />;
    if (change < 0) return <ArrowDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md border-muted/50",
        onClick && "cursor-pointer hover:border-primary/30 active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <p className="text-sm font-medium text-muted-foreground leading-none">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight leading-none">
              {value}
            </p>
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-semibold",
                getChangeColor(change)
              )}>
                {getChangeIcon(change)}
                <span>{Math.abs(change)}%</span>
                <span className="font-normal text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-3 shrink-0", colorClasses[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
