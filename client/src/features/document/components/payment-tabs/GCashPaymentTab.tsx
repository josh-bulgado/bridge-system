/**
 * GCash Payment Tab
 * 
 * UI for GCash/online payment verification.
 * Shows payment proof image and reference number for verification.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { PaymentDetailsCard } from "../PaymentDetailsCard";
import type { DocumentRequest } from "../../types/documentRequest";
import { isPaymentVerifiedForGCash, getGCashPaymentMessage } from "../../utils";

interface GCashPaymentTabProps {
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isProcessing: boolean;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function GCashPaymentTab({
  request,
  isPaymentVerified,
  isProcessing,
  onApprovePayment,
  onRejectPayment,
  onImagePreview,
}: GCashPaymentTabProps) {
  const isPendingPaymentVerification = request.status === "pending" && !isPaymentVerified;
  const { title, description } = getGCashPaymentMessage(request);

  return (
    <div className="mt-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">
            {description}
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
        ) : isPendingPaymentVerification ? (
          <Badge variant="secondary" className="h-8 border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400 px-3 text-sm font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            Pending Verification
          </Badge>
        ) : (
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            Pending
          </Badge>
        )}
      </div>

      {/* Payment Details Card - Shows proof of payment */}
      <PaymentDetailsCard
        amount={request.amount}
        referenceNumber={request.paymentReferenceNumber}
        paymentProof={request.paymentProof}
        onImagePreview={onImagePreview}
      />

      {/* Action Buttons - Show when payment needs verification */}
      {!isPaymentVerified && isPendingPaymentVerification && (
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

      {/* Success Message after payment verified */}
      {isPaymentVerified && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Payment Verified Successfully</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                You can now proceed to review and approve the supporting documents.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
