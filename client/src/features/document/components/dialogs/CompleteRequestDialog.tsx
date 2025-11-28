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
import { Loader2, CheckCircle } from "lucide-react";

interface CompleteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  trackingNumber: string;
  documentType: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function CompleteRequestDialog({
  open,
  onOpenChange,
  residentName,
  trackingNumber,
  documentType,
  notes,
  onNotesChange,
  onConfirm,
  isProcessing,
}: CompleteRequestDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Mark as Completed
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Confirm that <strong>{residentName}</strong> has successfully
              picked up their document.
            </p>
            <div className="bg-muted space-y-1.5 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tracking Number:</span>
                <code className="font-mono font-semibold">
                  {trackingNumber}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Document Type:</span>
                <span className="font-medium">{documentType}</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="complete-notes">Notes (Optional)</Label>
          <Textarea
            id="complete-notes"
            placeholder="Any notes about the pickup (e.g., 'Document picked up by authorized representative')..."
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
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
