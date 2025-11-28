/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Clock, ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationProgressStepperProps {
  currentStatus: "Not Submitted" | "Pending" | "Under Review" | "Approved" | "Rejected" | string;
  onStartVerification: () => void;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming" | string;
}

export const VerificationProgressStepper: React.FC<VerificationProgressStepperProps> = ({
  currentStatus,
  onStartVerification,
}) => {
  const getSteps = (): Step[] => {
    const baseSteps = [
      {
        id: 1,
        title: "Upload Documents",
        description: "Submit valid ID and proof of residency",
        icon: Upload,
      },
      {
        id: 2,
        title: "Under Review",
        description: "Staff reviews your documents (1-3 days)",
        icon: Clock,
      },
      {
        id: 3,
        title: "Get Verified",
        description: "Access all barangay services",
        icon: ShieldCheck,
      },
    ];

    // Determine step status based on current verification status
    let completedUntil = 0;
    if (currentStatus === "Pending" || currentStatus === "Under Review") {
      completedUntil = 1;
    } else if (currentStatus === "Approved") {
      completedUntil = 3;
    }

    return baseSteps.map((step) => ({
      ...step,
      status:
        step.id < completedUntil
          ? "completed"
          : step.id === completedUntil || (completedUntil === 1 && step.id === 2)
          ? "current"
          : "upcoming",
    })) as Step[];
  };

  const steps = getSteps();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle>Verification Process</CardTitle>
        </div>
        <CardDescription>
          Complete these steps to access all barangay services
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Steps - Desktop Horizontal */}
        <div className="hidden lg:flex items-center justify-between relative mb-8">
          {/* Progress Line */}
          <div className="absolute left-0 right-0 top-8 h-0.5 bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{
                width: `${((steps.filter((s) => s.status === "completed").length) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, _index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
                    step.status === "completed" &&
                      "bg-green-600 dark:bg-green-700 text-white shadow-lg",
                    step.status === "current" &&
                      "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-400 shadow-md",
                    step.status === "upcoming" &&
                      "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle className="h-7 w-7" />
                  ) : (
                    <Icon className="h-7 w-7" />
                  )}
                </div>

                {/* Text */}
                <div className="text-center max-w-[150px]">
                  <h4
                    className={cn(
                      "font-semibold text-sm mb-1",
                      step.status === "completed" && "text-green-600 dark:text-green-400",
                      step.status === "current" && "text-foreground",
                      step.status === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Steps - Mobile Vertical */}
        <div className="lg:hidden space-y-4 mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex gap-4 relative">
                {/* Vertical Line */}
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800">
                    {step.status === "completed" && (
                      <div className="h-full w-full bg-green-600" />
                    )}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all",
                    step.status === "completed" &&
                      "bg-green-600 dark:bg-green-700 text-white",
                    step.status === "current" &&
                      "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-400",
                    step.status === "upcoming" &&
                      "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <h4
                    className={cn(
                      "font-semibold mb-1",
                      step.status === "completed" && "text-green-600 dark:text-green-400",
                      step.status === "current" && "text-foreground",
                      step.status === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Required Documents Card */}
        <div className="rounded-lg border-2 border-dashed border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 p-4 mb-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-sm">Required Documents</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  Valid Government ID (front and back)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  Proof of Residency (utility bill, lease agreement, etc.)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {currentStatus !== "Approved" && currentStatus !== "Pending" && currentStatus !== "Under Review" && (
          <Button
            onClick={onStartVerification}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            size="lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            {currentStatus === "Rejected" ? "Resubmit Documents" : "Start Verification Process"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
