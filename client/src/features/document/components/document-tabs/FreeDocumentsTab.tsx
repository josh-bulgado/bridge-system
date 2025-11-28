/**
 * Free Documents Tab
 * 
 * UI for free document supporting documents review.
 * Simple workflow - just approve/reject documents.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, BadgeCheck, FileText } from "lucide-react";
import { SupportingDocumentsGrid } from "../SupportingDocumentsGrid";
import type { DocumentRequest } from "../../types/documentRequest";

interface FreeDocumentsTabProps {
  request: DocumentRequest;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function FreeDocumentsTab({
  request,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: FreeDocumentsTabProps) {
  const getStatusBadge = () => {
    if (request.status === "approved") {
      return (
        <Badge variant="default" className="h-8 bg-green-600 px-3 text-sm font-medium">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Documents Approved
        </Badge>
      );
    }

    if (request.status === "processing") {
      return (
        <Badge variant="default" className="h-8 bg-purple-600 px-3 text-sm font-medium">
          <FileText className="mr-1.5 h-4 w-4" />
          Processing
        </Badge>
      );
    }

    if (request.status === "rejected") {
      return (
        <Badge variant="destructive" className="h-8 px-3 text-sm font-medium">
          <XCircle className="mr-1.5 h-4 w-4" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="h-8 border-2 border-orange-500/50 bg-orange-500/10 px-3 text-sm font-medium text-orange-700 dark:text-orange-400">
        <Clock className="mr-1.5 h-4 w-4" />
        Pending Review
      </Badge>
    );
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Supporting Documents</h3>
          <p className="text-muted-foreground text-sm">
            Review all documents submitted by the resident
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <SupportingDocumentsGrid
        documents={request.supportingDocuments}
        onImagePreview={onImagePreview}
      />

      {/* Document Review Action Buttons */}
      {request.status === "pending" && !request.reviewedAt && (
        <div className="space-y-4 pt-4">
          {canReviewDocuments && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <BadgeCheck className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Ready for Document Review</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    This is a free document. You can proceed to review the supporting documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button
              onClick={onApproveDocument}
              disabled={isProcessing || !canReviewDocuments}
              size="lg"
            >
              <CheckCircle size={20} />
              Approve Documents
            </Button>
            <Button
              onClick={onRejectDocument}
              disabled={isProcessing || !canReviewDocuments}
              variant="destructive"
              size="lg"
            >
              <XCircle size={20} />
              Reject Documents
            </Button>
          </div>
        </div>
      )}

      {/* Generate Document Button */}
      {canGenerate && (
        <div className="space-y-4 pt-4">
          <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FileText className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Ready for Document Generation</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Documents approved. You can now generate the official document.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-2">
            <Button
              onClick={onGenerateDocument}
              disabled={isProcessing}
              className="h-12 w-full bg-blue-600 font-semibold hover:bg-blue-700"
              size="lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
