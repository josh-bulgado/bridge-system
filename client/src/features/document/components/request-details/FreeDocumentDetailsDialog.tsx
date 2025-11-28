/**
 * Free Document Request Details Dialog
 * 
 * Simplified dialog for free documents - only shows supporting documents tab (no payment tab)
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentRequestInfoCard } from "../DocumentRequestInfoCard";
import { FreeDocumentsTab } from "../document-tabs";
import type { DocumentRequest } from "../../types/documentRequest";

interface FreeDocumentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DocumentRequest;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function FreeDocumentDetailsDialog({
  open,
  onOpenChange,
  request,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: FreeDocumentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-xl font-bold">Document Request Details</DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tracking Number:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">{request.trackingNumber}</code>
          </div>
        </DialogHeader>
        
        {/* Basic Request Information */}
        <div className="space-y-6">
          <DocumentRequestInfoCard request={request} />

          {/* Free documents only need the documents tab - no payment tab */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
