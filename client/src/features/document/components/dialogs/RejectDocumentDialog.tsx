import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RejectDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  rejectionReason: string;
  notes: string;
  onRejectionReasonChange: (reason: string) => void;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function RejectDocumentDialog({
  open,
  onOpenChange,
  residentName,
  rejectionReason,
  notes,
  onRejectionReasonChange,
  onNotesChange,
  onConfirm,
  isProcessing,
}: RejectDocumentDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    onRejectionReasonChange("");
    onNotesChange("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Document Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting the document request for{" "}
            <strong>{residentName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-rejection-reason">
              Rejection Reason *
            </Label>
            <Textarea
              id="document-rejection-reason"
              placeholder="Enter the reason for rejection (e.g., invalid documents, incomplete information)..."
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-reject-notes">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="document-reject-notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isProcessing || !rejectionReason.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              "Reject Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
