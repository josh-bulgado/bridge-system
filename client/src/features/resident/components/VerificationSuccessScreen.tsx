import { CheckCircle, Clock, Bell } from "lucide-react";

export const VerificationSuccessScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
          Thank You for Submitting!
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your verification request has been successfully submitted. Our barangay staff will carefully review your documents and get back to you soon.
        </p>

        {/* What happens next section */}
        <div className="mt-6 space-y-3 text-left bg-muted/50 rounded-lg p-4">
          <p className="text-xs font-semibold text-foreground mb-2">What happens next:</p>
          
          <div className="flex gap-3 items-start">
            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Review Process</p>
              <p className="text-xs text-muted-foreground">Staff will verify your documents within 1-3 business days.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Bell className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Notification</p>
              <p className="text-xs text-muted-foreground">You'll receive a notification once your verification is approved or if additional information is needed.</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          You can close this dialog and continue using the dashboard.
        </p>
      </div>
    </div>
  );
};
