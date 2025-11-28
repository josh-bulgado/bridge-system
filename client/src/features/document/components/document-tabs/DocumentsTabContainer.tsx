/**
 * Documents Tab Container
 * 
 * Orchestrator that decides which documents tab to render based on payment method.
 */

import type { DocumentRequest } from "../../types/documentRequest";
import { isFreeDocument, isCashOnPickup, isGCashOnlinePayment } from "../../utils";
import { FreeDocumentsTab } from "./FreeDocumentsTab";
import { CashOnPickupDocumentsTab } from "./CashOnPickupDocumentsTab";
import { GCashDocumentsTab } from "./GCashDocumentsTab";

interface DocumentsTabContainerProps {
  request: DocumentRequest;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function DocumentsTabContainer({
  request,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: DocumentsTabContainerProps) {
  // Render Free Documents tab
  if (isFreeDocument(request)) {
    return (
      <FreeDocumentsTab
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

  // Render Cash on Pickup documents tab
  if (isCashOnPickup(request)) {
    return (
      <CashOnPickupDocumentsTab
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

  // Render GCash documents tab
  if (isGCashOnlinePayment(request)) {
    return (
      <GCashDocumentsTab
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

  // Fallback - should not happen
  return (
    <div className="mt-6 p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
      <p className="text-sm text-red-700 dark:text-red-400">
        Unknown document request type
      </p>
    </div>
  );
}
