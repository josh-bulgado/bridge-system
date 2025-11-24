import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload, Clock, ShieldCheck } from "lucide-react";

interface HowToVerifyCardProps {
  onStartVerification: () => void;
}

export const HowToVerifyCard: React.FC<HowToVerifyCardProps> = ({
  onStartVerification,
}) => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Submit valid ID and proof of residency",
    },
    {
      icon: Clock,
      title: "Wait for Review",
      description: "Staff reviews your documents (1-3 business days)",
    },
    {
      icon: CheckCircle2,
      title: "Get Verified",
      description: "Receive confirmation and access all services",
    },
  ];

  return (
    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-green-800 dark:text-green-200">
            How to Get Verified
          </CardTitle>
        </div>
        <CardDescription className="text-green-700 dark:text-green-300">
          Complete verification to request documents and access all services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <step.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="font-medium text-sm">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Required Documents */}
        <div className="rounded-lg border border-green-200 bg-white dark:border-green-800 dark:bg-green-950/30 p-4 space-y-2">
          <h4 className="font-medium text-sm">Required Documents:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
              Valid Government ID (front and back)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
              Proof of Residency (utility bill, lease, etc.)
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStartVerification}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          Start Verification Process
        </Button>
      </CardContent>
    </Card>
  );
};
