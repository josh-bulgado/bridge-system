/**
 * Request Details Dialog Container
 * 
 * Orchestrator that decides which request details dialog to render based on payment method
 */

import type { DocumentRequest } from "../../types/documentRequest";
import { isFreeDocument, isCashOnPickup, isGCashOnlinePayment } from "../../utils";
import { FreeDocumentDetailsDialog } from "./FreeDocumentDetailsDialog";
import { CashOnPickupDetailsDialog } from "./CashOnPickupDetailsDialog";
import { GCashDetailsDialog } from "./GCashDetailsDialog";

interface RequestDetailsDialogContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isWalkinPayment: boolean;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function RequestDetailsDialogContainer({
  open,
  onOpenChange,
  request,
  isPaymentVerified,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  activeTab,
  onTabChange,
  onApprovePayment,
  onRejectPayment,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: RequestDetailsDialogContainerProps) {
  // Render Free Document dialog - simplest UI
  if (isFreeDocument(request)) {
    return (
      <FreeDocumentDetailsDialog
        open={open}
        onOpenChange={onOpenChange}
        request={request}
        canReviewDocuments={canReviewDocuments}
        canGenerate={canGenerate}
        isProcessing={isProcessing}
        onApproveDocument={onApproveDocument}
        onRejectDocument={onRejectDocument}
        onGenerateDocument={onGenerateDocument}
        onImagePreview={onImagePreview}
      />
    );
  }

  // Render Cash on Pickup dialog - Documents → Payment flow
  if (isCashOnPickup(request)) {
    return (
      <CashOnPickupDetailsDialog
        open={open}
        onOpenChange={onOpenChange}
        request={request}
        isPaymentVerified={isPaymentVerified}
        canReviewDocuments={canReviewDocuments}
        canGenerate={canGenerate}
        isProcessing={isProcessing}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onApprovePayment={onApprovePayment}
        onRejectPayment={onRejectPayment}
        onApproveDocument={onApproveDocument}
        onRejectDocument={onRejectDocument}
        onGenerateDocument={onGenerateDocument}
        onImagePreview={onImagePreview}
      />
    );
  }

  // Render GCash dialog - Payment → Documents flow
  if (isGCashOnlinePayment(request)) {
    return (
      <GCashDetailsDialog
        open={open}
        onOpenChange={onOpenChange}
        request={request}
        isPaymentVerified={isPaymentVerified}
        canReviewDocuments={canReviewDocuments}
        canGenerate={canGenerate}
        isProcessing={isProcessing}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onApprovePayment={onApprovePayment}
        onRejectPayment={onRejectPayment}
        onApproveDocument={onApproveDocument}
        onRejectDocument={onRejectDocument}
        onGenerateDocument={onGenerateDocument}
        onImagePreview={onImagePreview}
      />
    );
  }

  // Fallback
  return null;
}
