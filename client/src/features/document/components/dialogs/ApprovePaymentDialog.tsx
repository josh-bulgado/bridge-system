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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

interface ApprovePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function ApprovePaymentDialog({
  open,
  onOpenChange,
  residentName,
  notes,
  onNotesChange,
  onConfirm,
  isProcessing,
}: ApprovePaymentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve the GCash payment for{" "}
            <strong>{residentName}</strong>? This will unlock the document
            review step.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="payment-notes">Notes (Optional)</Label>
          <Textarea
            id="payment-notes"
            placeholder="Any notes about the payment verification..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Spinner />
                Approving...
              </>
            ) : (
              "Approve Payment"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
