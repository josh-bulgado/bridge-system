import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

interface VerificationHeaderProps {
  onBack: () => void;
}

export const VerificationHeader = ({ onBack }: VerificationHeaderProps) => {
  return (
    <div className="mb-4">
      <Button variant="ghost" onClick={onBack} className="mb-3 -ml-2" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
        <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        Verify Your Residency
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Complete verification to access all barangay services
      </p>
    </div>
  );
};
