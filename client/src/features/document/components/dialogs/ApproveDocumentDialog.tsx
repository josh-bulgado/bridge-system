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
import { Loader2 } from "lucide-react";

interface ApproveDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function ApproveDocumentDialog({
  open,
  onOpenChange,
  residentName,
  notes,
  onNotesChange,
  onConfirm,
  isProcessing,
}: ApproveDocumentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Document Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this document request for{" "}
            <strong>{residentName}</strong>? The document will be ready for
            generation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="approve-notes">Notes (Optional)</Label>
          <Textarea
            id="approve-notes"
            placeholder="Any notes about the approval..."
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve Request"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
