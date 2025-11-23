import { useState } from "react";
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
import { UserX } from "lucide-react";

interface RejectVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  residentName: string;
  isLoading?: boolean;
}

export function RejectVerificationDialog({
  isOpen,
  onClose,
  onConfirm,
  residentName,
  isLoading = false,
}: RejectVerificationDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason(""); // Reset for next use
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reject Verification</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject the verification request for{" "}
            <span className="font-semibold">{residentName}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Rejection (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for rejecting this verification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-muted-foreground text-xs">
              This information may be sent to the resident to help them
              understand why their verification was rejected.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            <UserX className="mr-2 size-4" />
            {isLoading ? "Rejecting..." : "Reject Verification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
