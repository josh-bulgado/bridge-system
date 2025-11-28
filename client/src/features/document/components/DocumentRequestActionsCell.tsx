import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { Eye, FileText, Download, CheckCircle, Package } from "lucide-react";
import type { DocumentRequest } from "../types/documentRequest";
import {
  useApproveDocumentRequest,
  useRejectDocumentRequest,
  useVerifyPayment,
  useCompleteDocumentRequest,
  useMarkReadyForPickup,
} from "../hooks";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { DocumentGenerationModal } from "./DocumentGenerationModal";
import { DocumentRequestDetailsDialog } from "./DocumentRequestDetailsDialog";
import { GeneratedDocumentViewer } from "./GeneratedDocumentViewer";
import { ApprovePaymentDialog } from "./dialogs/ApprovePaymentDialog";
import { RejectPaymentDialog } from "./dialogs/RejectPaymentDialog";
import { ApproveDocumentDialog } from "./dialogs/ApproveDocumentDialog";
import { RejectDocumentDialog } from "./dialogs/RejectDocumentDialog";
import { CompleteRequestDialog } from "./dialogs/CompleteRequestDialog";

interface DocumentRequestActionsCellProps {
  request: DocumentRequest;
}

export function DocumentRequestActionsCell({
  request,
}: DocumentRequestActionsCellProps) {
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("payment");
  const [approvePaymentDialogOpen, setApprovePaymentDialogOpen] =
    React.useState(false);
  const [rejectPaymentDialogOpen, setRejectPaymentDialogOpen] =
    React.useState(false);
  const [approveDocumentDialogOpen, setApproveDocumentDialogOpen] =
    React.useState(false);
  const [rejectDocumentDialogOpen, setRejectDocumentDialogOpen] =
    React.useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [imagePreviewOpen, setImagePreviewOpen] = React.useState(false);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(
    null,
  );
  const [previewImageTitle, setPreviewImageTitle] = React.useState<string>("");
  const [generateModalOpen, setGenerateModalOpen] = React.useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = React.useState(false);

  const approveMutation = useApproveDocumentRequest();
  const rejectMutation = useRejectDocumentRequest();
  const verifyPaymentMutation = useVerifyPayment();
  const completeMutation = useCompleteDocumentRequest();
  const markReadyForPickupMutation = useMarkReadyForPickup();

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    verifyPaymentMutation.isPending ||
    completeMutation.isPending ||
    markReadyForPickupMutation.isPending;

  // Determine verification status
  const isPaymentVerified =
    request.paymentVerifiedAt !== undefined &&
    request.paymentVerifiedAt !== null;
  const isWalkinPayment = request.paymentMethod === "walkin";
  const canReviewDocuments = isPaymentVerified || isWalkinPayment;

  // Check if document can be generated
  const canGenerate =
    request.status === "approved" ||
    request.status === "payment_verified" ||
    request.status === "processing";

  // Check if generated document is available
  const hasGeneratedDocument =
    request.generatedDocumentUrl &&
    (request.status === "processing" ||
      request.status === "ready_for_pickup" ||
      request.status === "completed");
  
  // Check if can mark as ready for pickup (after document generation)
  const canMarkReadyForPickup = 
    request.status === "processing" && 
    request.generatedDocumentUrl;
  
  // Check if request can be completed (marked as picked up)
  const canComplete = request.status === "ready_for_pickup";

  // Reset tab when dialog opens
  const handleViewDetails = () => {
    setActiveTab(isWalkinPayment ? "documents" : "payment");
    setViewDetailsOpen(true);
  };

  const handleImagePreview = (url: string, title: string) => {
    setPreviewImageUrl(url);
    setPreviewImageTitle(title);
    setImagePreviewOpen(true);
  };

  const handleGenerateDocument = () => {
    setGenerateModalOpen(true);
  };

  const handleViewPdf = () => {
    setPdfPreviewOpen(true);
  };

  // Payment verification handlers
  const confirmApprovePayment = () => {
    verifyPaymentMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setApprovePaymentDialogOpen(false);
          setNotes("");
          setActiveTab("documents");
        },
      },
    );
  };

  const confirmRejectPayment = () => {
    if (!rejectionReason.trim()) return;

    rejectMutation.mutate(
      { id: request.id, data: { rejectionReason, notes } },
      {
        onSuccess: () => {
          setRejectPaymentDialogOpen(false);
          setRejectionReason("");
          setNotes("");
          setViewDetailsOpen(false);
        },
      },
    );
  };

  // Document approval handlers
  const confirmApproveDocument = () => {
    approveMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setApproveDocumentDialogOpen(false);
          setNotes("");
          setViewDetailsOpen(false);
        },
      },
    );
  };

  const confirmRejectDocument = () => {
    if (!rejectionReason.trim()) return;

    rejectMutation.mutate(
      { id: request.id, data: { rejectionReason, notes } },
      {
        onSuccess: () => {
          setRejectDocumentDialogOpen(false);
          setRejectionReason("");
          setNotes("");
          setViewDetailsOpen(false);
        },
      },
    );
  };

  // Mark as ready for pickup handler
  const handleMarkReadyForPickup = () => {
    markReadyForPickupMutation.mutate(request.id);
  };

  // Complete request handler
  const confirmCompleteRequest = () => {
    completeMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setCompleteDialogOpen(false);
          setNotes("");
          setViewDetailsOpen(false);
        },
      },
    );
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleViewDetails}
              >
                <Eye className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>

          {canGenerate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-500 hover:text-white"
                  onClick={handleGenerateDocument}
                >
                  <FileText className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate Document</TooltipContent>
            </Tooltip>
          )}

          {hasGeneratedDocument && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:bg-green-500 hover:text-white"
                  onClick={handleViewPdf}
                >
                  <Download className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Generated Document</TooltipContent>
            </Tooltip>
          )}

          {canMarkReadyForPickup && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-orange-600 hover:bg-orange-500 hover:text-white"
                  onClick={handleMarkReadyForPickup}
                  disabled={isProcessing}
                >
                  <Package className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {request.documentFormat === "softcopy" 
                  ? "Mark as Ready for Download" 
                  : "Mark as Ready for Pickup"}
              </TooltipContent>
            </Tooltip>
          )}

          {canComplete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                  onClick={() => setCompleteDialogOpen(true)}
                >
                  <CheckCircle className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as Completed</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {/* View Details Dialog */}
      <DocumentRequestDetailsDialog
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        request={request}
        isPaymentVerified={isPaymentVerified}
        isWalkinPayment={isWalkinPayment}
        canReviewDocuments={canReviewDocuments}
        canGenerate={canGenerate}
        isProcessing={isProcessing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onApprovePayment={() => setApprovePaymentDialogOpen(true)}
        onRejectPayment={() => setRejectPaymentDialogOpen(true)}
        onApproveDocument={() => setApproveDocumentDialogOpen(true)}
        onRejectDocument={() => setRejectDocumentDialogOpen(true)}
        onGenerateDocument={handleGenerateDocument}
        onImagePreview={handleImagePreview}
      />

      {/* Approve Payment Dialog */}
      <ApprovePaymentDialog
        open={approvePaymentDialogOpen}
        onOpenChange={setApprovePaymentDialogOpen}
        residentName={request.residentName}
        notes={notes}
        onNotesChange={setNotes}
        onConfirm={confirmApprovePayment}
        isProcessing={isProcessing}
      />

      {/* Reject Payment Dialog */}
      <RejectPaymentDialog
        open={rejectPaymentDialogOpen}
        onOpenChange={setRejectPaymentDialogOpen}
        residentName={request.residentName}
        rejectionReason={rejectionReason}
        notes={notes}
        onRejectionReasonChange={setRejectionReason}
        onNotesChange={setNotes}
        onConfirm={confirmRejectPayment}
        isProcessing={isProcessing}
      />

      {/* Approve Document Dialog */}
      <ApproveDocumentDialog
        open={approveDocumentDialogOpen}
        onOpenChange={setApproveDocumentDialogOpen}
        residentName={request.residentName}
        notes={notes}
        onNotesChange={setNotes}
        onConfirm={confirmApproveDocument}
        isProcessing={isProcessing}
      />

      {/* Reject Document Dialog */}
      <RejectDocumentDialog
        open={rejectDocumentDialogOpen}
        onOpenChange={setRejectDocumentDialogOpen}
        residentName={request.residentName}
        rejectionReason={rejectionReason}
        notes={notes}
        onRejectionReasonChange={setRejectionReason}
        onNotesChange={setNotes}
        onConfirm={confirmRejectDocument}
        isProcessing={isProcessing}
      />

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>{previewImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            {previewImageUrl && (
              <InlineDocumentViewer
                title={previewImageTitle}
                url={previewImageUrl}
                publicId=""
                fileType="image/jpeg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Generation Modal */}
      <DocumentGenerationModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        documentRequestId={request.id}
        residentName={request.residentName}
        documentType={request.documentType}
      />

      {/* Generated PDF Viewer */}
      <GeneratedDocumentViewer
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        request={request}
      />

      {/* Complete Request Dialog */}
      <CompleteRequestDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        residentName={request.residentName}
        trackingNumber={request.trackingNumber}
        documentType={request.documentType}
        notes={notes}
        onNotesChange={setNotes}
        onConfirm={confirmCompleteRequest}
        isProcessing={isProcessing}
      />
    </>
  );
}
