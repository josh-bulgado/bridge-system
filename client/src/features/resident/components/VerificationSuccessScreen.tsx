import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface VerificationSuccessScreenProps {
  onBackToDashboard: () => void;
}

export const VerificationSuccessScreen = ({
  onBackToDashboard,
}: VerificationSuccessScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6">
      <div className="text-center space-y-3 max-w-sm">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
          Verification Submitted!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your verification request has been submitted and is now under review by barangay staff.
        </p>
        
        <div className="flex justify-center pt-3">
          <Button 
            onClick={onBackToDashboard}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            size="sm"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
