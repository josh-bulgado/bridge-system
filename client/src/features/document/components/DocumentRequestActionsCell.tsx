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
} from "lucide-react";
import type { DocumentRequest } from "../types/documentRequest";

interface DocumentRequestActionsCellProps {
  request: DocumentRequest;
}

export function DocumentRequestActionsCell({
  request,
}: DocumentRequestActionsCellProps) {
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  // TODO: Replace with actual hooks when backend is ready
  const isProcessing = false;

  const handleViewDetails = () => {
    setViewDetailsOpen(true);
  };

  const handleApprove = () => {
    setApproveDialogOpen(true);
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    // TODO: Implement approve mutation
    console.log("Approving request:", request.id);
    setApproveDialogOpen(false);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    // TODO: Implement reject mutation
    console.log("Rejecting request:", request.id, rejectionReason);
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  const handleGenerateDocument = () => {
    // TODO: Implement document generation
    console.log("Generating document for request:", request.id);
  };

  const canApprove = request.status === "pending";
  const canReject = request.status === "pending" || request.status === "approved";
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
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
    </>
  );
}
