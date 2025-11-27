import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, BadgeCheck, Lock, FileText, Loader2 } from "lucide-react";
import { SupportingDocumentsGrid } from "./SupportingDocumentsGrid";
import type { DocumentRequest } from "../types/documentRequest";

interface SupportingDocumentsTabProps {
  request: DocumentRequest;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function SupportingDocumentsTab({
  request,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: SupportingDocumentsTabProps) {
  const getStatusBadge = () => {
    if (request.status === "approved") {
      return (
        <Badge variant="default" className="bg-green-600 h-8 px-3 text-sm font-medium">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Documents Approved
        </Badge>
      );
    }
    
    if (request.status === "payment_verified") {
      return (
        <Badge variant="default" className="bg-blue-600 h-8 px-3 text-sm font-medium">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Payment Verified
        </Badge>
      );
    }
    
    if (request.status === "processing") {
      return (
        <Badge variant="default" className="bg-purple-600 h-8 px-3 text-sm font-medium">
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          Processing
        </Badge>
      );
    }
    
    if (request.status === "ready_for_pickup") {
      return (
        <Badge variant="default" className="bg-indigo-600 h-8 px-3 text-sm font-medium">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Ready for Pickup
        </Badge>
      );
    }
    
    if (request.status === "completed") {
      return (
        <Badge variant="default" className="bg-emerald-600 h-8 px-3 text-sm font-medium">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Completed
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
      <Badge variant="secondary" className="h-8 px-3 text-sm font-medium border-2 border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400">
        <Clock className="mr-1.5 h-4 w-4" />
        Pending Review
      </Badge>
    );
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Status Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Supporting Documents</h3>
          <p className="text-sm text-muted-foreground">Review all documents submitted by the resident</p>
        </div>
        {getStatusBadge()}
      </div>

      <SupportingDocumentsGrid
        documents={request.supportingDocuments}
        onImagePreview={onImagePreview}
      />

      {/* Document Review Action Buttons */}
      {request.status === "pending" && (
        <div className="space-y-4 pt-4">
          {/* Show success message when payment is verified */}
          {canReviewDocuments && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <BadgeCheck className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Payment Verified - Ready for Document Review</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You can now approve or reject the supporting documents below
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Show warning when payment is not yet verified */}
          {!canReviewDocuments && (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Lock className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Payment Verification Required</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please verify the payment first before reviewing documents
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 pt-2 border-t">
            <Button
              onClick={onApproveDocument}
              disabled={isProcessing || !canReviewDocuments}
              className="flex-1 h-11 bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Approve Documents
            </Button>
            <Button
              onClick={onRejectDocument}
              disabled={isProcessing || !canReviewDocuments}
              variant="destructive"
              className="flex-1 h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <XCircle className="mr-2 h-5 w-5" />
              Reject Documents
            </Button>
          </div>
        </div>
      )}

      {/* Generate Document Button - Show when payment is verified */}
      {canGenerate && (
        <div className="space-y-4 pt-4">
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FileText className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Ready for Document Generation</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Payment has been verified. You can now generate the official document.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <Button
              onClick={onGenerateDocument}
              disabled={isProcessing}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
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
