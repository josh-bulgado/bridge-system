/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  IconInfoCircle,
  IconCopy,
  IconCheck,
  IconLoader2,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
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
      <Dialog
        open={open && !showQrFullView}
        onOpenChange={(isOpen) => {
          // Only close, don't clear data (data cleared by Cancel/X button explicitly)
          if (!isOpen) {
            onOpenChange(false);
          }
        }}
      >
        <DialogContent
          className="max-h-[95vh] max-w-lg overflow-y-auto sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onCloseAutoFocus={() => {
            // When X button is clicked, clear the form
            if (!isPending) {
              setReferenceNumber("");
              setReceiptImage("");
            }
          }}
        >
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg">
              Complete GCash Payment
            </DialogTitle>
            <DialogDescription className="text-sm">
              Pay ₱{documentPrice.toFixed(2)} to complete your request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Amount to Pay */}
            <div className="bg-muted rounded-lg border p-3 text-center">
              <p className="text-muted-foreground mb-0.5 text-xs">
                Amount to Pay
              </p>
              <p className="text-foreground text-2xl font-bold">
                ₱{documentPrice.toFixed(2)}
              </p>
            </div>

            {/* QR Code and Account Details - Side by Side on Desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* QR Code */}
              <div className="flex justify-center sm:justify-start">
                <div
                  className="border-primary/20 hover:border-primary/40 cursor-pointer rounded-lg border-2 bg-white p-2 transition-colors"
                  onClick={() =>
                    gcashConfig?.gcashQrCodeUrl && setShowQrFullView(true)
                  }
                >
                  {gcashConfig?.gcashQrCodeUrl ? (
                    <div className="relative">
                      <img
                        src={gcashConfig.gcashQrCodeUrl}
                        alt="GCash QR Code"
                        className="h-40 w-40 object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black/0 transition-colors hover:bg-black/10">
                        <p className="text-xs text-white opacity-0 transition-opacity hover:opacity-100">
                          Click to enlarge
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 flex h-40 w-40 items-center justify-center rounded">
                      <div className="space-y-1 text-center">
                        <div className="text-4xl">📱</div>
                        <p className="text-muted-foreground px-2 text-xs">
                          QR Code
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-2">
                <div className="bg-muted rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold">
                    GCASH NUMBER
                  </p>
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
                        onClick={() =>
                          copyToClipboard(gcashConfig.gcashNumber!)
                        }
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

                <div className="bg-muted rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold">
                    ACCOUNT NAME
                  </p>
                  <p className="text-base font-bold">
                    {gcashConfig?.gcashAccountName || "Barangay Office"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Number Input */}
            <div className="space-y-1.5">
              <Label htmlFor="reference-number" className="text-sm">
                Reference Number *
              </Label>
              <Input
                id="reference-number"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder=""
                value={referenceNumber}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  setReferenceNumber(value);
                }}
                disabled={isPending}
                className="h-9"
              />
            </div>

            {/* Receipt Screenshot Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="receipt-upload" className="text-sm">
                Receipt Screenshot *
              </Label>
              {receiptImage ? (
                <div className="border-primary/20 bg-muted/50 relative rounded-lg border-2 p-2">
                  <img
                    src={receiptImage}
                    alt="Receipt"
                    className="h-32 w-full rounded object-contain"
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
                  className={`hover:bg-muted/50 flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    isPending || isUploading
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    {isUploading ? (
                      <>
                        <IconLoader2 className="text-muted-foreground mb-1 h-6 w-6 animate-spin" />
                        <p className="text-muted-foreground text-xs">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <IconUpload className="text-muted-foreground mb-1 h-6 w-6" />
                        <p className="text-muted-foreground text-xs">
                          Click to upload receipt
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          PNG, JPG up to 10MB
                        </p>
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
                <p className="mb-1 font-semibold">How to pay:</p>
                <ol className="ml-1 list-inside list-decimal space-y-0.5">
                  <li>Open your GCash app</li>
                  <li>Scan the QR code or send to the number above</li>
                  <li>Enter the exact amount: ₱{documentPrice.toFixed(2)}</li>
                  <li>Complete the payment</li>
                  <li>Screenshot your receipt</li>
                  <li>Enter the reference number and upload receipt</li>
                </ol>
                <p className="mt-1.5 text-[11px]">
                  <strong>Note:</strong> Staff will verify your payment before
                  processing.
                </p>
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
              disabled={
                !referenceNumber.trim() ||
                !receiptImage ||
                isPending ||
                isUploading
              }
              className="h-9"
            >
              {isPending && (
                <IconLoader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Full View Modal - Separate Dialog */}
      <Dialog open={showQrFullView} onOpenChange={setShowQrFullView}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-6 shadow-none [&>button]:hidden">
          <div className="relative rounded-lg bg-white p-8 shadow-2xl">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-50 rounded-full shadow-lg"
              onClick={() => setShowQrFullView(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center gap-4 pt-8">
              <img
                src={gcashConfig?.gcashQrCodeUrl}
                alt="GCash QR Code - Full View"
                className="h-auto w-full max-w-md object-contain"
              />
              <p className="text-muted-foreground text-center text-sm">
                Scan this QR code with your GCash app
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
