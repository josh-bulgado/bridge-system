import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

interface VerificationHeaderProps {
  onBack: () => void;
}

export const VerificationHeader = ({ onBack }: VerificationHeaderProps) => {
  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
        <ShieldCheck className="h-8 w-8 text-orange-600" />
        Verify Your Residency
      </h1>
      <p className="mt-2 text-gray-600">
        Complete the verification process to access all barangay services
      </p>
    </div>
  );
};
