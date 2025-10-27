import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertTriangle } from "lucide-react";
import type { PaymentRecord } from "../types/payment";
import { rejectionReasons } from "../types/payment";

interface RejectionModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentId: string, reason: string, note?: string) => void;
  isLoading?: boolean;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  payment,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customNote, setCustomNote] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleClose = () => {
    setSelectedReason("");
    setCustomNote("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      setError("Please select a rejection reason");
      return;
    }

    const selectedReasonData = rejectionReasons.find(r => r.value === selectedReason);
    if (selectedReasonData?.requiresNote && !customNote.trim()) {
      setError("Please provide additional details for this rejection reason");
      return;
    }

    if (!payment) return;

    const finalReason = selectedReason === 'other' 
      ? customNote.trim()
      : selectedReasonData?.label || selectedReason;

    onConfirm(payment.id, finalReason, customNote.trim() || undefined);
    handleClose();
  };

  const selectedReasonData = rejectionReasons.find(r => r.value === selectedReason);

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-red-600">
              Reject Payment
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alert */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              The resident will be notified of this rejection and can resubmit their payment.
            </AlertDescription>
          </Alert>

          {/* Payment Details */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono">{payment.paymentId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requester:</span>
              <span className="font-medium">{payment.requesterName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-green-600">
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(payment.amount)}
              </span>
            </div>
          </div>

          {/* Rejection Reason Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason for rejection" />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Note for "Other" or Required Notes */}
          {(selectedReason === 'other' || selectedReasonData?.requiresNote) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {selectedReason === 'other' ? 'Please specify' : 'Additional details'}
                <span className="text-red-500"> *</span>
              </label>
              <Textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={
                  selectedReason === 'other' 
                    ? "Describe the issue with this payment..."
                    : "Provide additional details about this rejection..."
                }
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          {/* Optional Note for Other Reasons */}
          {selectedReason && selectedReason !== 'other' && !selectedReasonData?.requiresNote && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Additional notes (optional)
              </label>
              <Textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Add any additional context..."
                rows={2}
                className="resize-none"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};