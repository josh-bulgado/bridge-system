import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCheck, IconFileText } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNumber?: string;
  paymentMethod?: "online" | "walkin";
  onSubmitAnother?: () => void;
  requestId?: string;
}

export function ThankYouDialog({
  open,
  onOpenChange,
  trackingNumber,
  paymentMethod,
  onSubmitAnother,
  requestId,
}: ThankYouDialogProps) {
  const navigate = useNavigate();

  const handleTrackRequests = () => {
    onOpenChange(false);
    // Navigate directly to the detail page of the just-submitted request
    if (requestId) {
      navigate(`/resident/requests/${requestId}`);
    } else {
      // Fallback to list page if no requestId
      navigate("/resident/requests");
    }
  };

  const handleSubmitAnother = () => {
    onOpenChange(false);
    onSubmitAnother?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <IconCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-2xl text-center">Thank You!</DialogTitle>
          <DialogDescription className="text-base text-center">
            Thank you for using <span className="font-semibold text-primary">Bridge</span>. 
            Your document request has been submitted successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {trackingNumber && (
            <div className="bg-muted p-4 rounded-lg space-y-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
              <p className="text-lg font-mono font-semibold">{trackingNumber}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            {paymentMethod === "online" ? (
              <>
                <p className="flex items-start gap-2">
                  <IconFileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Your payment is being verified by our staff. You'll be notified once it's confirmed.</span>
                </p>
              </>
            ) : (
              <>
                <p className="flex items-start gap-2">
                  <IconFileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Your request is being processed. Please prepare payment upon pickup.</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSubmitAnother}
          >
            Submit Another
          </Button>
          <Button
            className="flex-1"
            onClick={handleTrackRequests}
          >
            Track My Requests
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
