import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconInfoCircle, IconCopy, IconCheck, IconLoader2, IconUpload, IconX } from "@tabler/icons-react";
import type { GCashConfig } from "../services/residentDocumentRequestService";
import { verificationService } from "../services/verificationService";
import { toast } from "sonner";

interface GCashPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gcashConfig?: GCashConfig;
  documentPrice: number;
  onConfirmPayment: (referenceNumber: string, receiptUrl: string) => void;
  isPending?: boolean;
}

export function GCashPaymentDialog({
  open,
  onOpenChange,
  gcashConfig,
  documentPrice,
  onConfirmPayment,
  isPending = false,
}: GCashPaymentDialogProps) {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showQrFullView, setShowQrFullView] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedFile = await verificationService.uploadFile(file);
      setReceiptImage(uploadedFile.url);
      toast.success("Receipt uploaded successfully");
    } catch (error: any) {
      console.error("Failed to upload receipt:", error);
      toast.error(error.message || "Failed to upload receipt");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptImage("");
  };

  const handleConfirm = () => {
    if (referenceNumber.trim() && receiptImage) {
      onConfirmPayment(referenceNumber.trim(), receiptImage);
    } else if (!referenceNumber.trim()) {
      toast.error("Please enter a reference number");
    } else if (!receiptImage) {
      toast.error("Please upload a receipt screenshot");
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setReferenceNumber("");
      setReceiptImage("");
      onOpenChange(false);
    }
  };


  return (
    <>
    <Dialog open={open && !showQrFullView} onOpenChange={(isOpen) => {
      // Only close, don't clear data (data cleared by Cancel/X button explicitly)
      if (!isOpen) {
        onOpenChange(false);
      }
    }}>
      <DialogContent 
        className="max-w-lg sm:max-w-md max-h-[95vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          // When X button is clicked, clear the form
          if (!isPending) {
            setReferenceNumber("");
            setReceiptImage("");
          }
        }}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg">Complete GCash Payment</DialogTitle>
          <DialogDescription className="text-sm">
            Pay ₱{documentPrice.toFixed(2)} to complete your request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Amount to Pay */}
          <div className="rounded-lg border bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Amount to Pay</p>
            <p className="text-2xl font-bold text-foreground">₱{documentPrice.toFixed(2)}</p>
          </div>

          {/* QR Code and Account Details - Side by Side on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* QR Code */}
            <div className="flex justify-center sm:justify-start">
              <div 
                className="rounded-lg border-2 border-primary/20 p-2 bg-white cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => gcashConfig?.gcashQrCodeUrl && setShowQrFullView(true)}
              >
                {gcashConfig?.gcashQrCodeUrl ? (
                  <div className="relative">
                    <img
                      src={gcashConfig.gcashQrCodeUrl}
                      alt="GCash QR Code"
                      className="h-40 w-40 object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors rounded">
                      <p className="text-xs text-white opacity-0 hover:opacity-100 transition-opacity">
                        Click to enlarge
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 w-40 flex items-center justify-center bg-muted/30 rounded">
                    <div className="text-center space-y-1">
                      <div className="text-4xl">📱</div>
                      <p className="text-xs text-muted-foreground px-2">
                        QR Code
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-2">
              <div className="rounded-lg border bg-muted p-3">
                <p className="text-xs text-muted-foreground font-semibold mb-1">GCASH NUMBER</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-bold">
                    {gcashConfig?.gcashNumber || "0917-123-4567"}
                  </p>
                  {gcashConfig?.gcashNumber && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => copyToClipboard(gcashConfig.gcashNumber!)}
                    >
                      {copiedNumber ? (
                        <IconCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <IconCopy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border bg-muted p-3">
                <p className="text-xs text-muted-foreground font-semibold mb-1">ACCOUNT NAME</p>
                <p className="text-base font-bold">
                  {gcashConfig?.gcashAccountName || "Barangay Office"}
                </p>
              </div>
            </div>
          </div>

          {/* Reference Number Input */}
          <div className="space-y-1.5">
            <Label htmlFor="reference-number" className="text-sm">Reference Number *</Label>
            <Input
              id="reference-number"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              placeholder=""
              value={referenceNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setReferenceNumber(value);
              }}
              disabled={isPending}
              className="h-9"
            />
          </div>

          {/* Receipt Screenshot Upload */}
          <div className="space-y-1.5">
            <Label htmlFor="receipt-upload" className="text-sm">Receipt Screenshot *</Label>
            {receiptImage ? (
              <div className="relative rounded-lg border-2 border-primary/20 p-2 bg-muted/50">
                <img
                  src={receiptImage}
                  alt="Receipt"
                  className="w-full h-32 object-contain rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={handleRemoveReceipt}
                  disabled={isPending || isUploading}
                >
                  <IconX className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="receipt-upload"
                className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  isPending || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center py-2">
                  {isUploading ? (
                    <>
                      <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <IconUpload className="h-6 w-6 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload receipt</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isPending || isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Instructions */}
          <Alert className="py-2.5">
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription className="text-xs leading-relaxed">
              <p className="font-semibold mb-1">How to pay:</p>
              <ol className="list-decimal list-inside space-y-0.5 ml-1">
                <li>Open your GCash app</li>
                <li>Scan the QR code or send to the number above</li>
                <li>Enter the exact amount: ₱{documentPrice.toFixed(2)}</li>
                <li>Complete the payment</li>
                <li>Screenshot your receipt</li>
                <li>Enter the reference number and upload receipt</li>
              </ol>
              <p className="mt-1.5 text-[11px]"><strong>Note:</strong> Staff will verify your payment before processing.</p>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!referenceNumber.trim() || !receiptImage || isPending || isUploading}
            className="h-9"
          >
            {isPending && <IconLoader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* QR Code Full View Modal - Separate Dialog */}
    <Dialog open={showQrFullView} onOpenChange={setShowQrFullView}>
      <DialogContent className="max-w-3xl p-6 bg-transparent border-0 shadow-none [&>button]:hidden">
        <div className="relative bg-white rounded-lg p-8 shadow-2xl">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full shadow-lg z-50"
            onClick={() => setShowQrFullView(false)}
          >
            <IconX className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center gap-4 pt-8">
            <img
              src={gcashConfig?.gcashQrCodeUrl}
              alt="GCash QR Code - Full View"
              className="w-full max-w-md h-auto object-contain"
            />
            <p className="text-center text-sm text-muted-foreground">
              Scan this QR code with your GCash app
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
