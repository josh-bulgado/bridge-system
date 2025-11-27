import * as React from "react";
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
    <div className="space-y-6 mt-6">
      {/* Status Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">GCash Payment</h3>
          <p className="text-sm text-muted-foreground">Review and verify the payment details below</p>
        </div>
        {isPaymentVerified ? (
          <Badge variant="default" className="bg-green-600 h-8 px-3 text-sm font-medium">
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
        <div className="flex gap-4 pt-6 border-t">
          <Button
            onClick={onApprovePayment}
            disabled={isProcessing}
            className="flex-1 h-11 bg-green-600 hover:bg-green-700 font-semibold"
            size="lg"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Approve Payment
          </Button>
          <Button
            onClick={onRejectPayment}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1 h-11 font-semibold"
            size="lg"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Reject Payment
          </Button>
        </div>
      )}
    </div>
  );
}
