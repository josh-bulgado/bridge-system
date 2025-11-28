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
  const isWalkinPayment = request.paymentMethod === "walkin";
  // For walk-in: Show buttons when status is "approved" (documents already approved, waiting for resident)
  // For GCash: Show buttons when status is "pending" (payment needs verification first)
  const isApprovedAwaitingPayment = request.status === "approved" && !isPaymentVerified;
  const isPendingPaymentVerification = request.status === "pending" && !isPaymentVerified && !isWalkinPayment;
  
  return (
    <div className="mt-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {isWalkinPayment ? "Cash on Pickup Payment" : "GCash Payment"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isWalkinPayment 
              ? "Payment will be collected when resident picks up the document"
              : "Review and verify the payment details below"}
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
        ) : isApprovedAwaitingPayment ? (
          <Badge variant="secondary" className="h-8 border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 text-sm font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            Awaiting Payment
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

      {/* For walk-in payment waiting for resident */}
      {isWalkinPayment && isApprovedAwaitingPayment && (
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Waiting for Resident
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  The resident has been notified that their document is ready. They will come to the barangay hall to pay 
                  <span className="font-semibold text-foreground"> ₱{request.amount.toLocaleString()}</span> in cash and pick up their document.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium mb-2">Next Steps:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Wait for resident to arrive at barangay hall</li>
                <li>Collect cash payment of ₱{request.amount.toLocaleString()}</li>
                <li>Click "Approve Payment" below to confirm payment received</li>
                <li>Generate and provide the document</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* For online payment with proof */}
      {!isWalkinPayment && (
        <PaymentDetailsCard
          amount={request.amount}
          referenceNumber={request.paymentReferenceNumber}
          paymentProof={request.paymentProof}
          onImagePreview={onImagePreview}
        />
      )}

      {/* For walk-in payment display amount info */}
      {isWalkinPayment && !isApprovedAwaitingPayment && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Document Type</p>
              <p className="text-sm font-medium">{request.documentType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Amount to Collect</p>
              <p className="text-sm font-semibold">₱{request.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isPaymentVerified && (isApprovedAwaitingPayment || isPendingPaymentVerification) && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={onApprovePayment}
            disabled={isProcessing}
            size="lg"
          >
            <CheckCircle size={20}/>
            {isWalkinPayment ? "Confirm Payment Received" : "Approve Payment"}
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
