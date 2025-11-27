import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationStatusCardProps {
  status: "Not Submitted" | "Pending" | "Under Review" | "Approved" | "Rejected";
  isVerified: boolean;
  onStartVerification: () => void;
  rejectionReason?: string;
}

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({
  status,
  isVerified,
  onStartVerification,
  rejectionReason,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Approved":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-800",
          title: "Verified Resident",
          description: "Your residency is verified and active",
          progress: 100,
          progressColor: "bg-green-600",
        };
      case "Pending":
      case "Under Review":
        return {
          icon: Clock,
          iconColor: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          title: "Verification In Progress",
          description: "Documents under review (1-3 business days)",
          progress: 66,
          progressColor: "bg-blue-600",
        };
      case "Rejected":
        return {
          icon: XCircle,
          iconColor: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
          title: "Verification Rejected",
          description: "Please review and resubmit your documents",
          progress: 33,
          progressColor: "bg-red-600",
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-950/20",
          borderColor: "border-orange-200 dark:border-orange-800",
          title: "Verification Required",
          description: "Complete verification to access all services",
          progress: 0,
          progressColor: "bg-orange-600",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  // Don't show the card at all for verified users
  if (isVerified) {
    return null;
  }

  return (
    <Card className={cn("border-2", config.borderColor, config.bgColor)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn("rounded-full p-2", config.bgColor)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{config.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {config.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium">{config.progress}%</span>
              </div>
              <Progress value={config.progress} className="h-1.5" />
            </div>

            {/* Rejection Reason */}
            {status === "Rejected" && rejectionReason && (
              <div className="rounded-md bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 p-3">
                <p className="font-semibold text-xs text-red-900 dark:text-red-200 mb-1">
                  Reason for Rejection:
                </p>
                <p className="text-xs text-red-800 dark:text-red-300">
                  {rejectionReason}
                </p>
              </div>
            )}

            {/* Action Button */}
            {status !== "Pending" && status !== "Under Review" && (
              <Button
                onClick={onStartVerification}
                className="w-full sm:w-auto h-8"
                size="sm"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {status === "Rejected" ? "Resubmit Documents" : "Start Verification"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
