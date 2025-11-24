import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconInfoCircle, IconCopy, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { GCashConfig } from "../services/residentDocumentRequestService";

interface GCashPaymentInfoProps {
  gcashConfig?: GCashConfig;
}

export function GCashPaymentInfo({ gcashConfig }: GCashPaymentInfoProps) {
  const [copiedNumber, setCopiedNumber] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  if (!gcashConfig?.gcashNumber) {
    return (
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          GCash payment information is not available at the moment. Please contact the barangay office or choose Cash on Pickup.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <IconInfoCircle className="h-5 w-5 text-primary" />
          GCash Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* QR Code */}
          {gcashConfig.gcashQrCodeUrl && (
            <div className="flex justify-center">
              <div className="rounded-lg border-2 border-primary/20 p-3 bg-white">
                <img
                  src={gcashConfig.gcashQrCodeUrl}
                  alt="GCash QR Code"
                  className="h-48 w-48 object-contain"
                />
              </div>
            </div>
          )}

          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Scan QR Code or send to:</p>
          </div>

          {/* GCash Number */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">GCash Number</p>
                <p className="text-lg font-bold font-mono">{gcashConfig.gcashNumber}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(gcashConfig.gcashNumber!)}
              >
                {copiedNumber ? (
                  <IconCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Account Name */}
            {gcashConfig.gcashAccountName && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Account Name</p>
                <p className="font-medium">{gcashConfig.gcashAccountName}</p>
              </div>
            )}
          </div>
        </div>

        <Alert>
          <IconInfoCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Important:</strong> After payment, enter the GCash reference number below. Your request will be verified by staff before processing.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
