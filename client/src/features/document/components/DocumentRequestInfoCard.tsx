import * as React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DocumentRequest } from "../types/documentRequest";

interface DocumentRequestInfoCardProps {
  request: DocumentRequest;
}

export function DocumentRequestInfoCard({ request }: DocumentRequestInfoCardProps) {
  const isWalkinPayment = request.paymentMethod === "walkin";

  return (
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
            {formatCurrency(request.amount)}
          </p>
        </div>
        <div className="space-y-2 col-span-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Purpose</Label>
          <p className="text-sm capitalize">{request.purpose}</p>
        </div>
        {request.additionalDetails && (
          <div className="space-y-2 col-span-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Additional Details</Label>
            <p className="text-sm">{request.additionalDetails}</p>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
          <Badge variant={request.status === "approved" ? "default" : request.status === "rejected" ? "destructive" : "secondary"} className="w-fit capitalize">
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
  );
}
