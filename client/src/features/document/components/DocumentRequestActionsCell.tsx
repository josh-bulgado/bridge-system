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
import {
  canReviewDocuments as canReviewDocumentsUtil,
  canGenerateDocument,
  getPaymentMethodChecks,
  getInitialTab,
} from "../utils";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { DocumentGenerationModal } from "./DocumentGenerationModal";
import { RequestDetailsDialogContainer } from "./request-details";
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

  // Use organized payment method logic
  const canReviewDocuments = canReviewDocumentsUtil(currentRequest);
  const canGenerate = canGenerateDocument(currentRequest);
  const { isWalkinPayment, isFreeDocument, isOnlinePayment, isPaymentVerified } = 
    getPaymentMethodChecks(currentRequest);

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
    
    if (isWalkinPayment) {
      console.log('=== Cash on Pickup Debug ===');
      console.log('Request ID:', currentRequest.id);
      console.log('Status:', currentRequest.status);
      console.log('Payment Method:', currentRequest.paymentMethod);
      console.log('reviewedAt:', currentRequest.reviewedAt);
      console.log('paymentVerifiedAt:', currentRequest.paymentVerifiedAt);
      console.log('isWalkinPayment:', isWalkinPayment);
      console.log('isPaymentVerified:', isPaymentVerified);
      console.log('canGenerate:', canGenerate);
      console.log('Condition Check:');
      console.log('  - status === "approved":', currentRequest.status === "approved");
      console.log('  - paymentVerifiedAt !== null:', currentRequest.paymentVerifiedAt !== null);
      console.log('  - paymentVerifiedAt !== undefined:', currentRequest.paymentVerifiedAt !== undefined);
      console.log('  - isPaymentVerified:', isPaymentVerified);
      console.log('===================================');
    }
  }, [currentRequest.id, currentRequest.status, currentRequest.reviewedAt, currentRequest.paymentVerifiedAt, isOnlinePayment, isWalkinPayment, isPaymentVerified, canGenerate]);

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
    const initialTab = getInitialTab(currentRequest);
    setActiveTab(initialTab);
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
  const confirmApprovePayment = async () => {
    verifyPaymentMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: async () => {
          setApprovePaymentDialogOpen(false);
          setNotes("");
          // Force refetch to get updated data immediately
          await refetchRequest();
          // Switch to documents tab after data is refreshed
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
  const confirmApproveDocument = async () => {
    approveMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: async () => {
          setApproveDocumentDialogOpen(false);
          setNotes("");
          // Don't close the details dialog immediately - let user see the generate button appear
          // Force refetch to get updated data immediately
          await refetchRequest();
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
  const handleMarkReadyForPickup = async () => {
    markReadyForPickupMutation.mutate(request.id, {
      onSuccess: async () => {
        // Refetch to update the button visibility immediately
        await refetchRequest();
      },
    });
  };

  // Complete request handler
  const confirmCompleteRequest = async () => {
    completeMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: async () => {
          setCompleteDialogOpen(false);
          setNotes("");
          // Refetch to update the status immediately, then close the dialog
          await refetchRequest();
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

      {/* View Details Dialog - Uses payment method-specific dialogs */}
      <RequestDetailsDialogContainer
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
