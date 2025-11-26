import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  MessageSquare,
  Package,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick: () => void;
  disabled?: boolean;
}

interface EnhancedQuickActionsProps {
  isVerified: boolean;
  onNewRequest?: () => void;
  onViewRequests?: () => void;
  onContactOffice?: () => void;
  onViewPickup?: () => void;
}

export const EnhancedQuickActions: React.FC<EnhancedQuickActionsProps> = ({
  isVerified,
  onNewRequest,
  onViewRequests,
  onContactOffice,
  onViewPickup,
}) => {
  const primaryActions: QuickAction[] = [
    {
      id: "new-request",
      label: "New Request",
      description: "Submit a document request",
      icon: Plus,
      color: "text-white",
      bgColor: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
      onClick: onNewRequest || (() => {}),
      disabled: !isVerified,
    },
    {
      id: "view-requests",
      label: "My Requests",
      description: "View all your requests",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900",
      onClick: onViewRequests || (() => {}),
      disabled: !isVerified,
    },
    {
      id: "pickup",
      label: "Pickup",
      description: "Ready documents",
      icon: Package,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900",
      onClick: onViewPickup || (() => {}),
      disabled: !isVerified,
    },
  ];

  // Removed secondary actions - moved to footer

  return (
    <div>
      {/* Primary Actions - Main Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.id === "new-request";

          return (
            <Card
              key={action.id}
              className={cn(
                "overflow-hidden transition-colors duration-200 cursor-pointer",
                isPrimary
                  ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
                  : "hover:border-green-500 dark:hover:border-green-500",
                action.disabled && "opacity-60 cursor-not-allowed"
              )}
              onClick={!action.disabled ? action.onClick : undefined}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      isPrimary
                        ? action.bgColor
                        : action.bgColor
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isPrimary ? action.color : action.color
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-semibold text-base mb-1",
                        isPrimary && !action.disabled && "text-green-700 dark:text-green-300"
                      )}
                    >
                      {action.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.disabled ? "Verification required" : action.description}
                    </p>
                  </div>

                  {/* Badge for primary action */}
                  {isPrimary && !action.disabled && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
