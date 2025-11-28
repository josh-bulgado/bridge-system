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
  useFetchDocumentRequestById,
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

  // Fetch real-time data when dialog is open
  const { data: liveRequest, refetch: refetchRequest } = useFetchDocumentRequestById(
    request.id,
    viewDetailsOpen // Only fetch when dialog is open
  );

  // Use live data if available, otherwise use prop data
  const currentRequest = liveRequest || request;

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    verifyPaymentMutation.isPending ||
    completeMutation.isPending ||
    markReadyForPickupMutation.isPending;

  // Determine verification status (use current request data)
  const isPaymentVerified =
    currentRequest.paymentVerifiedAt !== undefined &&
    currentRequest.paymentVerifiedAt !== null;
  const isWalkinPayment = currentRequest.paymentMethod === "walkin";
  const isFreeDocument = currentRequest.amount === 0;
  const isOnlinePayment = currentRequest.paymentMethod === "online";
  
  // For walk-in/cash on pickup: Can review documents immediately when pending (not yet reviewed)
  // For free documents: Can review immediately when pending (not yet reviewed)
  // For online payment (GCash): Can review documents when status is "payment_verified" AND not yet reviewed
  const canReviewDocuments = 
    (isFreeDocument && currentRequest.status === "pending" && !currentRequest.reviewedAt) || 
    (isWalkinPayment && currentRequest.status === "pending" && !currentRequest.reviewedAt) ||
    (isOnlinePayment && currentRequest.status === "payment_verified" && !currentRequest.reviewedAt);

  // Check if document can be generated
  // For free documents: Allow generation when status is "approved" (documents approved, no payment needed)
  // For GCash/online payments: Allow generation when status is "payment_verified" AND documents are reviewed (both payment and documents approved)
  // For walk-in payments: Allow generation when status is "approved" AND payment is verified (documents approved, resident came and paid)
  // Also allow if already in "processing" state
  const canGenerate =
    (isFreeDocument && currentRequest.status === "approved") ||
    (isOnlinePayment && currentRequest.status === "payment_verified" && currentRequest.reviewedAt !== null && currentRequest.reviewedAt !== undefined) ||
    (isWalkinPayment && currentRequest.status === "approved" && isPaymentVerified) ||
    currentRequest.status === "processing";

  // Debug logging
  React.useEffect(() => {
    if (isOnlinePayment) {
      console.log('=== GCash Generate Button Debug ===');
      console.log('Request ID:', currentRequest.id);
      console.log('Status:', currentRequest.status);
      console.log('Payment Method:', currentRequest.paymentMethod);
      console.log('reviewedAt:', currentRequest.reviewedAt);
      console.log('paymentVerifiedAt:', currentRequest.paymentVerifiedAt);
      console.log('isOnlinePayment:', isOnlinePayment);
      console.log('canGenerate:', canGenerate);
      console.log('Condition Check:');
      console.log('  - status === "payment_verified":', currentRequest.status === "payment_verified");
      console.log('  - reviewedAt !== null:', currentRequest.reviewedAt !== null);
      console.log('  - reviewedAt !== undefined:', currentRequest.reviewedAt !== undefined);
      console.log('===================================');
    }
  }, [currentRequest.id, currentRequest.status, currentRequest.reviewedAt, currentRequest.paymentVerifiedAt, isOnlinePayment, canGenerate]);

  // Check if generated document is available
  const hasGeneratedDocument =
    currentRequest.generatedDocumentUrl &&
    (currentRequest.status === "processing" ||
      currentRequest.status === "ready_for_pickup" ||
      currentRequest.status === "completed");
  
  // Check if can mark as ready for pickup (after document generation)
  const canMarkReadyForPickup = 
    currentRequest.status === "processing" && 
    currentRequest.generatedDocumentUrl;
  
  // Check if request can be completed (marked as picked up)
  const canComplete = currentRequest.status === "ready_for_pickup";

  // Reset tab when dialog opens
  const handleViewDetails = () => {
    // For free documents, go straight to documents tab
    // For paid documents (online or walk-in), start with appropriate tab based on status
    if (isFreeDocument) {
      setActiveTab("documents");
    } else if (currentRequest.status === "pending") {
      // Pending status: show payment tab for online, documents tab for walk-in
      setActiveTab(isWalkinPayment ? "documents" : "payment");
    } else if (currentRequest.status === "approved" && !isPaymentVerified) {
      // Approved but payment not verified: show payment tab
      setActiveTab("payment");
    } else {
      // Payment verified or other statuses: show documents tab
      setActiveTab("documents");
    }
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
          // Force refetch to get updated data immediately
          setTimeout(() => refetchRequest(), 100);
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
          // Don't close the details dialog immediately - let user see the generate button appear
          // Force refetch to get updated data immediately
          setTimeout(() => refetchRequest(), 100);
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
    markReadyForPickupMutation.mutate(request.id, {
      onSuccess: () => {
        // Refetch to update the button visibility immediately
        refetchRequest();
      },
    });
  };

  // Complete request handler
  const confirmCompleteRequest = () => {
    completeMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setCompleteDialogOpen(false);
          setNotes("");
          // Refetch to update the status immediately, then close the dialog
          refetchRequest().then(() => {
            setViewDetailsOpen(false);
          });
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
        request={currentRequest}
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
        request={currentRequest}
      />

      {/* Complete Request Dialog */}
      <CompleteRequestDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        residentName={currentRequest.residentName}
        trackingNumber={currentRequest.trackingNumber}
        documentType={currentRequest.documentType}
        notes={notes}
        onNotesChange={setNotes}
        onConfirm={confirmCompleteRequest}
        isProcessing={isProcessing}
      />
    </>
  );
}
