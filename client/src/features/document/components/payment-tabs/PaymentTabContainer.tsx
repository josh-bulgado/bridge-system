/**
 * Payment Tab Container
 * 
 * Orchestrator that decides which payment tab to render based on payment method.
 */

import type { DocumentRequest } from "../../types/documentRequest";
import { isCashOnPickup, isGCashOnlinePayment } from "../../utils";
import { CashOnPickupPaymentTab } from "./CashOnPickupPaymentTab";
import { GCashPaymentTab } from "./GCashPaymentTab";

interface PaymentTabContainerProps {
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isProcessing: boolean;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function PaymentTabContainer({
  request,
  isPaymentVerified,
  isProcessing,
  onApprovePayment,
  onRejectPayment,
  onImagePreview,
}: PaymentTabContainerProps) {
  // Render Cash on Pickup payment tab
  if (isCashOnPickup(request)) {
    return (
      <CashOnPickupPaymentTab
        request={request}
        isPaymentVerified={isPaymentVerified}
        isProcessing={isProcessing}
        onApprovePayment={onApprovePayment}
        onRejectPayment={onRejectPayment}
      />
    );
  }

  // Render GCash payment tab
  if (isGCashOnlinePayment(request)) {
    return (
      <GCashPaymentTab
        request={request}
        isPaymentVerified={isPaymentVerified}
        isProcessing={isProcessing}
        onApprovePayment={onApprovePayment}
        onRejectPayment={onRejectPayment}
        onImagePreview={onImagePreview}
      />
    );
  }

  // Fallback - should not happen for paid documents
  return (
    <div className="mt-6 p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
      <p className="text-sm text-red-700 dark:text-red-400">
        Unknown payment method: {request.paymentMethod}
      </p>
    </div>
  );
}
