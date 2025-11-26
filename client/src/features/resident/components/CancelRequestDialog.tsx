import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCancelDocumentRequest } from "../hooks/useCancelDocumentRequest";

interface CancelRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  trackingNumber: string;
  onSuccess?: () => void;
}

export function CancelRequestDialog({
  open,
  onOpenChange,
  requestId,
  trackingNumber,
  onSuccess,
}: CancelRequestDialogProps) {
  const cancelRequest = useCancelDocumentRequest();

  const handleCancel = () => {
    cancelRequest.mutate(requestId, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to cancel request{" "}
              <span className="font-semibold">{trackingNumber}</span>?
            </p>
            <p className="text-sm">
              This action cannot be undone. You will need to submit a new
              request if you change your mind.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelRequest.isPending}>
            Keep Request
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={cancelRequest.isPending}
            className="bg-destructive text-neutral-50 hover:bg-destructive/90"
          >
            {cancelRequest.isPending ? "Cancelling..." : "Yes, Cancel Request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
