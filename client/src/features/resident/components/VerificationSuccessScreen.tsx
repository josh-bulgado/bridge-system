import { CheckCircle } from "lucide-react";

export const VerificationSuccessScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6">
      <div className="text-center space-y-3 max-w-md">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
          Verification Submitted!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your verification request has been submitted and is now under review by barangay staff. You can close this dialog and continue using the dashboard.
        </p>
      </div>
    </div>
  );
};
