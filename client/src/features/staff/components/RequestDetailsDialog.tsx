import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, FileText, PhilippinePeso } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/format";

interface Request {
  id: string;
  trackingNumber: string;
  documentType: string;
  residentName: string;
  purpose: string;
  amount: number;
  status: string;
  submittedAt: Date;
  paymentStatus?: "paid" | "unpaid";
}

interface RequestDetailsDialogProps {
  request: Request | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsDialog({
  request,
  open,
  onOpenChange,
}: RequestDetailsDialogProps) {
  const navigate = useNavigate();

  if (!request) return null;

  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    pending: { label: "Pending Review", variant: "secondary" },
    approved: { label: "Approved", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
    payment_pending: { label: "Payment Pending", variant: "secondary" },
    payment_verified: { label: "Payment Verified", variant: "default" },
    ready_for_generation: { label: "Ready for Generation", variant: "default" },
    completed: { label: "Completed", variant: "default" },
  };

  const status = statusConfig[request.status] || statusConfig.pending;

  const handleViewFullDetails = () => {
    onOpenChange(false);
    navigate(`/staff/document-requests/${request.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">
            Request Details
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Tracking Number:
            </span>
            <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold">
              {request.trackingNumber}
            </code>
            <Badge variant={status.variant} className="ml-2">
              {status.label}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        {/* Request Information */}
        <div className="space-y-6 py-4">
          {/* Document & Resident Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <Label className="text-xs font-medium tracking-wide uppercase">
                  Document Type
                </Label>
              </div>
              <p className="text-base font-semibold">{request.documentType}</p>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                <Label className="text-xs font-medium tracking-wide uppercase">
                  Resident Name
                </Label>
              </div>
              <p className="text-base font-semibold">{request.residentName}</p>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Purpose
            </Label>
            <p className="bg-muted/50 rounded-md p-3 text-sm leading-relaxed capitalize">
              {request.purpose}
            </p>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <PhilippinePeso className="h-4 w-4" />
                <Label className="text-xs font-medium tracking-wide uppercase">
                  Amount
                </Label>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(request.amount)}
              </p>
              {request.paymentStatus && (
                <Badge
                  variant={
                    request.paymentStatus === "paid" ? "default" : "secondary"
                  }
                  className="w-fit"
                >
                  {request.paymentStatus === "paid" ? "✓ PAID" : "UNPAID"}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Label className="text-xs font-medium tracking-wide uppercase">
                  Submitted At
                </Label>
              </div>
              <p className="text-sm">
                {new Date(request.submittedAt).toLocaleDateString("en-PH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date(request.submittedAt).toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">

          <div className="flex gap-2">

            {/* Quick Actions based on status */}
            {request.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => {
                    // TODO: Handle reject
                    console.log("Reject:", request.id);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // TODO: Handle approve
                    console.log("Approve:", request.id);
                  }}
                >
                  Approve
                </Button>
              </>
            )}

            {request.status === "payment_pending" && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleViewFullDetails}
              >
                Verify Payment
              </Button>
            )}

            {request.status === "ready_for_generation" && (
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleViewFullDetails}
              >
                Generate Document
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
