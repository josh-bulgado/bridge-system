/**
 * Cash on Pickup Payment Tab
 * 
 * UI for cash on pickup payment verification.
 * Shows information about payment collection when resident arrives at barangay hall.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import type { DocumentRequest } from "../../types/documentRequest";
import { isPaymentVerifiedForCashOnPickup, getCashOnPickupPaymentMessage } from "../../utils";

interface CashOnPickupPaymentTabProps {
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isProcessing: boolean;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
}

export function CashOnPickupPaymentTab({
  request,
  isPaymentVerified,
  isProcessing,
  onApprovePayment,
  onRejectPayment,
}: CashOnPickupPaymentTabProps) {
  const isApprovedAwaitingPayment = request.status === "approved" && !isPaymentVerified;
  const { title, description } = getCashOnPickupPaymentMessage(request);
  
  // Debug logging for payment verification
  console.log('=== CashOnPickupPaymentTab Debug ===');
  console.log('Request ID:', request.id);
  console.log('Status:', request.status);
  console.log('paymentVerifiedAt:', request.paymentVerifiedAt);
  console.log('isPaymentVerified (prop):', isPaymentVerified);
  console.log('isApprovedAwaitingPayment:', isApprovedAwaitingPayment);
  console.log('===================================');

  return (
    <div className="mt-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Cash on Pickup Payment</h3>
          <p className="text-muted-foreground text-sm">
            Payment will be collected when resident picks up the document
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
        ) : (
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            Pending
          </Badge>
        )}
      </div>

      {/* Waiting for Resident Message */}
      {isApprovedAwaitingPayment && (
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {title}
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  {description}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium mb-2">Next Steps:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Wait for resident to arrive at barangay hall</li>
                <li>Collect cash payment of ₱{request.amount.toLocaleString()}</li>
                <li>Click "Confirm Payment Received" below to verify payment</li>
                <li>Generate the document after payment is confirmed</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Display amount info when not awaiting payment */}
      {!isApprovedAwaitingPayment && (
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
      {!isPaymentVerified && isApprovedAwaitingPayment && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={onApprovePayment}
            disabled={isProcessing}
            size="lg"
          >
            <CheckCircle size={20}/>
            Confirm Payment Received
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
