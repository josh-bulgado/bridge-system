import * as React from "react";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

interface PaymentDetailsCardProps {
  amount: number;
  referenceNumber?: string;
  paymentProof?: string;
  onImagePreview: (url: string, title: string) => void;
}

export function PaymentDetailsCard({
  amount,
  referenceNumber,
  paymentProof,
  onImagePreview,
}: PaymentDetailsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Payment Details */}
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
                {referenceNumber || "N/A"}
              </code>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
              <p className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(amount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Screenshot */}
      {paymentProof && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment Screenshot</Label>
          <div 
            className="group rounded-lg border-2 border-border hover:border-primary p-4 bg-muted/30 cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => onImagePreview(paymentProof, "GCash Payment")}
          >
            <div className="relative overflow-hidden rounded-md bg-background">
              <img 
                src={paymentProof} 
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
  );
}
