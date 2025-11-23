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
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import type { DocumentRequest } from "../types/documentRequest";
import {
  useApproveDocumentRequest,
  useRejectDocumentRequest,
  useVerifyPayment,
} from "../hooks";

interface DocumentRequestActionsCellProps {
  request: DocumentRequest;
}

export function DocumentRequestActionsCell({
  request,
}: DocumentRequestActionsCellProps) {
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [verifyPaymentDialogOpen, setVerifyPaymentDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const approveMutation = useApproveDocumentRequest();
  const rejectMutation = useRejectDocumentRequest();
  const verifyPaymentMutation = useVerifyPayment();

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    verifyPaymentMutation.isPending;

  const handleViewDetails = () => {
    setViewDetailsOpen(true);
  };

  const handleApprove = () => {
    setApproveDialogOpen(true);
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const handleVerifyPayment = () => {
    setVerifyPaymentDialogOpen(true);
  };

  const confirmApprove = () => {
    approveMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setApproveDialogOpen(false);
          setNotes("");
        },
      }
    );
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectMutation.mutate(
      { id: request.id, data: { rejectionReason, notes } },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setRejectionReason("");
          setNotes("");
        },
      }
    );
  };

  const confirmVerifyPayment = () => {
    verifyPaymentMutation.mutate(
      { id: request.id, data: { notes } },
      {
        onSuccess: () => {
          setVerifyPaymentDialogOpen(false);
          setNotes("");
        },
      }
    );
  };

  const handleGenerateDocument = () => {
    // TODO: Implement document generation
    console.log("Generating document for request:", request.id);
  };

  const canApprove = request.status === "pending";
  const canReject = request.status === "pending" || request.status === "approved";
  const canVerifyPayment = 
    request.status === "approved" || 
    request.status === "payment_pending" ||
    (request.status === "payment_verified" && request.paymentMethod === "online");
  const canGenerate = request.status === "ready_for_generation";

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {/* View Details */}
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

          {/* Approve (only for pending) */}
          {canApprove && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:bg-green-500 hover:text-white"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  <CheckCircle className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Approve Request</TooltipContent>
            </Tooltip>
          )}

          {/* Reject (for pending or approved) */}
          {canReject && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-500 hover:text-white"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  <XCircle className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reject Request</TooltipContent>
            </Tooltip>
          )}

          {/* Verify Payment */}
          {canVerifyPayment && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-500 hover:text-white"
                  onClick={handleVerifyPayment}
                  disabled={isProcessing}
                >
                  <BadgeCheck className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Verify Payment</TooltipContent>
            </Tooltip>
          )}

          {/* More Actions */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>More Actions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                View Full Details
              </DropdownMenuItem>

              {canGenerate && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleGenerateDocument}
                    className="text-blue-600"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Tracking Number: {request.trackingNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Resident Name</Label>
                <p className="text-sm">{request.residentName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm">{request.residentEmail}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Document Type</Label>
                <p className="text-sm">{request.documentType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <p className="text-sm">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(request.amount)}
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium">Purpose</Label>
                <p className="text-sm">{request.purpose}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm capitalize">
                  {request.status.replace(/_/g, " ")}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Submitted At</Label>
                <p className="text-sm">
                  {new Date(request.submittedAt).toLocaleString()}
                </p>
              </div>
              {request.rejectionReason && (
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-red-600">
                    Rejection Reason
                  </Label>
                  <p className="text-sm">{request.rejectionReason}</p>
                </div>
              )}
              {request.notes && (
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm">{request.notes}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this document request for{" "}
              <strong>{request.residentName}</strong>? This will move the
              request to the payment pending stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document request for{" "}
              <strong>{request.residentName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="reject-notes"
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
                setRejectDialogOpen(false);
                setRejectionReason("");
                setNotes("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
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

      {/* Verify Payment Dialog */}
      <Dialog open={verifyPaymentDialogOpen} onOpenChange={setVerifyPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Confirm that payment has been received for request{" "}
              <strong>{request.trackingNumber}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Resident</Label>
                <p className="text-sm">{request.residentName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <p className="text-sm">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(request.amount)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Method</Label>
                <p className="text-sm capitalize">{request.paymentMethod}</p>
              </div>
              {request.paymentProof && (
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium">Payment Proof</Label>
                  <a
                    href={request.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Payment Proof
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="verify-notes">Notes (Optional)</Label>
              <Textarea
                id="verify-notes"
                placeholder="Any notes about the payment verification..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setVerifyPaymentDialogOpen(false);
                setNotes("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmVerifyPayment}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
