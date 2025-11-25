import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  Loader2,
  BadgeCheck,
  Clock,
  Lock,
  AlertCircle,
} from "lucide-react";
import type { DocumentRequest } from "../types/documentRequest";
import {
  useApproveDocumentRequest,
  useRejectDocumentRequest,
  useVerifyPayment,
} from "../hooks";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { Badge } from "@/components/ui/badge";

interface DocumentRequestActionsCellProps {
  request: DocumentRequest;
}

export function DocumentRequestActionsCell({
  request,
}: DocumentRequestActionsCellProps) {
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("payment");
  const [approvePaymentDialogOpen, setApprovePaymentDialogOpen] = React.useState(false);
  const [rejectPaymentDialogOpen, setRejectPaymentDialogOpen] = React.useState(false);
  const [approveDocumentDialogOpen, setApproveDocumentDialogOpen] = React.useState(false);
  const [rejectDocumentDialogOpen, setRejectDocumentDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [imagePreviewOpen, setImagePreviewOpen] = React.useState(false);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);
  const [previewImageTitle, setPreviewImageTitle] = React.useState<string>("");

  const approveMutation = useApproveDocumentRequest();
  const rejectMutation = useRejectDocumentRequest();
  const verifyPaymentMutation = useVerifyPayment();

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    verifyPaymentMutation.isPending;

  // Determine verification status
  const isPaymentVerified = request.paymentVerifiedAt !== undefined && request.paymentVerifiedAt !== null;
  const isWalkinPayment = request.paymentMethod === "walkin";
  const canReviewDocuments = isPaymentVerified || isWalkinPayment;

  // Reset tab when dialog opens - default to documents tab if walkin, payment tab otherwise
  const handleViewDetails = () => {
    setActiveTab(isWalkinPayment ? "documents" : "payment");
    setViewDetailsOpen(true);
  };

  const handleImagePreview = (url: string, title: string) => {
    setPreviewImageUrl(url);
    setPreviewImageTitle(title);
    setImagePreviewOpen(true);
  };

  // Payment verification handlers
  const handleApprovePayment = () => {
    setApprovePaymentDialogOpen(true);
  };

  const handleRejectPayment = () => {
    setRejectPaymentDialogOpen(true);
  };

  const confirmApprovePayment = () => {
    verifyPaymentMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setApprovePaymentDialogOpen(false);
          setNotes("");
          setActiveTab("documents"); // Move to documents tab
        },
      }
    );
  };

  const confirmRejectPayment = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectMutation.mutate(
      { id: request.id, data: { rejectionReason, notes } },
      {
        onSuccess: () => {
          setRejectPaymentDialogOpen(false);
          setRejectionReason("");
          setNotes("");
          setViewDetailsOpen(false);
        },
      }
    );
  };

  // Document approval handlers
  const handleApproveDocument = () => {
    setApproveDocumentDialogOpen(true);
  };

  const handleRejectDocument = () => {
    setRejectDocumentDialogOpen(true);
  };

  const confirmApproveDocument = () => {
    approveMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setApproveDocumentDialogOpen(false);
          setNotes("");
          setViewDetailsOpen(false);
        },
      }
    );
  };

  const confirmRejectDocument = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectMutation.mutate(
      { id: request.id, data: { rejectionReason, notes } },
      {
        onSuccess: () => {
          setRejectDocumentDialogOpen(false);
          setRejectionReason("");
          setNotes("");
          setViewDetailsOpen(false);
        },
      }
    );
  };

  const handleGenerateDocument = () => {
    // TODO: Implement document generation
    console.log("Generating document for request:", request.id);
  };

  const canGenerate = request.status === "ready_for_generation";

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {/* View Details - All actions now done through tabs inside */}
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

          {/* Generate Document (only when ready) */}
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
        </div>
      </TooltipProvider>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
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
            {/* Information Card */}
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <h3 className="text-base font-semibold">Request Information</h3>
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Resident Name</Label>
                  <p className="text-sm font-medium">{request.residentName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                  <p className="text-sm truncate">{request.residentEmail}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Document Type</Label>
                  <p className="text-sm font-medium">{request.documentType}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</Label>
                  <p className="text-base font-bold text-green-600">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(request.amount)}
                  </p>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Purpose</Label>
                  <p className="text-sm">{request.purpose}</p>
                </div>
                {request.additionalDetails && (
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Additional Details</Label>
                    <p className="text-sm">{request.additionalDetails}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
                  <Badge variant={request.status === "approved" ? "default" : request.status === "rejected" ? "destructive" : "secondary"} className="w-fit">
                    {request.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Submitted At</Label>
                  <p className="text-sm">
                    {new Date(request.submittedAt).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Method</Label>
                  <p className="text-sm font-medium">{isWalkinPayment ? "Cash on Pickup" : "GCash"}</p>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {request.rejectionReason && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <Label className="text-xs font-medium text-destructive uppercase tracking-wide">Rejection Reason</Label>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p className="text-sm text-destructive">{request.rejectionReason}</p>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {request.notes && (
                <div className="pt-4 border-t space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Admin Notes</Label>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-sm">{request.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Two-Step Verification Tabs (or single tab for walkin) */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {!isWalkinPayment && (
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                  <TabsTrigger 
                    value="payment"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
                  >
                    {isPaymentVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Payment Verification</span>
                    {isPaymentVerified && (
                      <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
                        Verified
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
                  >
                    {request.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Supporting Documents</span>
                    {request.status === "approved" && (
                      <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
                        Approved
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              )}

              {/* Tab 1: Payment Verification */}
              <TabsContent value="payment" className="space-y-6 mt-6">
                {/* Status Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">GCash Payment</h3>
                    <p className="text-sm text-muted-foreground">Review and verify the payment details below</p>
                  </div>
                  {isPaymentVerified ? (
                    <Badge variant="default" className="bg-green-600 h-8 px-3 text-sm font-medium">
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Payment Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
                      <Clock className="mr-1.5 h-4 w-4" />
                      Pending Verification
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Payment Details Card */}
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-5 space-y-5">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment Details</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                          <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                          <p className="text-sm font-semibold">GCash</p>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <Label className="text-sm font-medium text-muted-foreground">Reference Number</Label>
                          <code className="text-sm font-mono font-semibold px-2 py-1 bg-muted rounded">
                            {request.paymentReferenceNumber || "N/A"}
                          </code>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                          <p className="text-lg font-bold text-green-600">
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(request.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Screenshot Card */}
                  {request.paymentProof && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment Screenshot</Label>
                      <div 
                        className="group rounded-lg border-2 border-border hover:border-primary p-4 bg-muted/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => handleImagePreview(request.paymentProof!, "GCash Payment")}
                      >
                        <div className="relative overflow-hidden rounded-md bg-background">
                          <img 
                            src={request.paymentProof} 
                            alt="Payment Proof" 
                            className="w-full h-64 object-contain"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3">
                              <Eye className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                          Click to view full size
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isPaymentVerified && (
                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      onClick={handleApprovePayment}
                      disabled={isProcessing}
                      className="flex-1 h-11 bg-green-600 hover:bg-green-700 font-semibold"
                      size="lg"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Approve Payment
                    </Button>
                    <Button
                      onClick={handleRejectPayment}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1 h-11 font-semibold"
                      size="lg"
                    >
                      <XCircle className="mr-2 h-5 w-5" />
                      Reject Payment
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Supporting Documents */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                {/* Status Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Supporting Documents</h3>
                    <p className="text-sm text-muted-foreground">Review all documents submitted by the resident</p>
                  </div>
                  {request.status === "approved" ? (
                    <Badge variant="default" className="bg-green-600 h-8 px-3 text-sm font-medium">
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Documents Approved
                    </Badge>
                  ) : request.status === "rejected" ? (
                    <Badge variant="destructive" className="h-8 px-3 text-sm font-medium">
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Rejected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="h-8 px-3 text-sm font-medium border-2 border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400">
                      <Clock className="mr-1.5 h-4 w-4" />
                      Pending Review
                    </Badge>
                  )}
                </div>

                {request.supportingDocuments && request.supportingDocuments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        {request.supportingDocuments.length} {request.supportingDocuments.length === 1 ? 'Document' : 'Documents'} Uploaded
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      {request.supportingDocuments.map((docUrl, index) => (
                        <div 
                          key={index} 
                          className="group rounded-lg border-2 border-border hover:border-primary p-4 bg-card cursor-pointer transition-all duration-200 hover:shadow-lg"
                          onClick={() => handleImagePreview(docUrl, `Supporting Document ${index + 1}`)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Document {index + 1}
                              </Label>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                                  <Eye className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            </div>
                            <div className="relative overflow-hidden rounded-md bg-muted/30">
                              <img 
                                src={docUrl} 
                                alt={`Supporting Document ${index + 1}`} 
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <p className="text-xs text-center text-muted-foreground font-medium">
                              Click to view full size
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed bg-muted/30 py-12">
                    <div className="text-center space-y-3">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">No Supporting Documents</p>
                        <p className="text-xs text-muted-foreground">The resident has not uploaded any documents yet.</p>
                      </div>
                    </div>
                  </div>
                )}

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
                        onClick={handleApproveDocument}
                        disabled={isProcessing || !canReviewDocuments}
                        className="flex-1 h-11 bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Approve Documents
                      </Button>
                      <Button
                        onClick={handleRejectDocument}
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
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Payment Confirmation Dialog */}
      <AlertDialog open={approvePaymentDialogOpen} onOpenChange={setApprovePaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the GCash payment for{" "}
              <strong>{request.residentName}</strong>? This will unlock the document review step.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="payment-notes">Notes (Optional)</Label>
            <Textarea
              id="payment-notes"
              placeholder="Any notes about the payment verification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprovePayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Payment Dialog */}
      <Dialog open={rejectPaymentDialogOpen} onOpenChange={setRejectPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the payment for{" "}
              <strong>{request.residentName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="payment-rejection-reason"
                placeholder="Enter the reason for payment rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-reject-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="payment-reject-notes"
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectPaymentDialogOpen(false);
                setRejectionReason("");
                setNotes("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectPayment}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Document Dialog */}
      <AlertDialog open={approveDocumentDialogOpen} onOpenChange={setApproveDocumentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Document Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this document request for{" "}
              <strong>{request.residentName}</strong>? The document will be ready for generation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="approve-notes">Notes (Optional)</Label>
            <Textarea
              id="approve-notes"
              placeholder="Any notes about the approval..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApproveDocument}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Document Dialog */}
      <Dialog open={rejectDocumentDialogOpen} onOpenChange={setRejectDocumentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the document request for{" "}
              <strong>{request.residentName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="document-rejection-reason"
                placeholder="Enter the reason for rejection (e.g., invalid documents, incomplete information)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-reject-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="document-reject-notes"
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDocumentDialogOpen(false);
                setRejectionReason("");
                setNotes("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectDocument}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
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
    </>
  );
}
