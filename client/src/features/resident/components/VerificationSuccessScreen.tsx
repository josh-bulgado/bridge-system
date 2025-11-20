import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface VerificationSuccessScreenProps {
  onBackToDashboard: () => void;
}

export const VerificationSuccessScreen = ({
  onBackToDashboard,
}: VerificationSuccessScreenProps) => {
  return (
    <div className="flex h-svh flex-col justify-center space-y-6 px-4 lg:px-6">
      <div className="mx-auto flex max-w-2xl">
        <div className="space-y-4 py-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h3 className="text-xl font-semibold text-green-800">
            Verification Submitted!
          </h3>
          <p className="text-gray-600">
            Your verification request has been submitted successfully. You
            will receive a notification once your account is verified.
          </p>
          <Button onClick={onBackToDashboard}>Return to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};
