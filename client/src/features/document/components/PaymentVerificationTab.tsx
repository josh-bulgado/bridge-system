import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { PaymentDetailsCard } from "./PaymentDetailsCard";
import type { DocumentRequest } from "../types/documentRequest";

interface PaymentVerificationTabProps {
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isProcessing: boolean;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function PaymentVerificationTab({
  request,
  isPaymentVerified,
  isProcessing,
  onApprovePayment,
  onRejectPayment,
  onImagePreview,
}: PaymentVerificationTabProps) {
  return (
    <div className="mt-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">GCash Payment</h3>
          <p className="text-muted-foreground text-sm">
            Review and verify the payment details below
          </p>
        </div>
        {isPaymentVerified ? (
          <Badge
            variant="default"
            className="h-8 bg-green-600 px-3 text-sm font-medium"
          >
            <CheckCircle className="mr-1.5 h-4 w-4" />
            Payment Verified
          </Badge>
        ) : (
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            Pending Verification
          </Badge>
        )}
      </div>

      <PaymentDetailsCard
        amount={request.amount}
        referenceNumber={request.paymentReferenceNumber}
        paymentProof={request.paymentProof}
        onImagePreview={onImagePreview}
      />

      {/* Action Buttons */}
      {!isPaymentVerified && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={onApprovePayment}
            disabled={isProcessing}
            size="lg"
          >
            <CheckCircle size={20}/>
            Approve Payment
          </Button>
          <Button
            onClick={onRejectPayment}
            disabled={isProcessing}
            variant="destructive"
            size="lg"
          >
            <XCircle className="" size={20} />
            Reject Payment
          </Button>
        </div>
      )}
    </div>
  );
}
