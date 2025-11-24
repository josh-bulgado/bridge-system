import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconFileText, IconClock, IconCreditCard, IconCurrencyPeso } from "@tabler/icons-react";
import type { Document } from "@/features/document/types/document";

interface OrderSummaryProps {
  selectedDocument: Document | null;
  paymentMethod: "online" | "walkin";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function OrderSummary({ selectedDocument, paymentMethod }: OrderSummaryProps) {
  const isFree = selectedDocument ? selectedDocument.price === 0 : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Info */}
        {selectedDocument ? (
          <>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconFileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedDocument.name}</p>
                  {selectedDocument.requirements.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {selectedDocument.requirements.length} requirement(s)
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No requirements needed
                    </p>
                  )}
                </div>
              </div>

              {/* Processing Time */}
              <div className="flex items-center gap-2 text-sm">
                <IconClock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Processing:</span>
                <span className="font-medium">{selectedDocument.processingTime}</span>
              </div>

              {/* Payment Method - Only show if not free */}
              {!isFree && (
                <div className="flex items-center gap-2 text-sm">
                  <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment:</span>
                  <Badge variant="outline">
                    {paymentMethod === "online" ? "GCash" : "Cash on Pickup"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Requirements - Only show if document has requirements */}
            {selectedDocument.requirements.length > 0 && (
              <>
                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Requirements:</p>
                  <ul className="space-y-1">
                    {selectedDocument.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />
              </>
            )}

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Document Fee</span>
                {isFree ? (
                  <Badge variant="secondary" className="bg-green-500/15 text-green-700 hover:bg-green-500/25">
                    FREE
                  </Badge>
                ) : (
                  <span className="font-medium">{formatCurrency(selectedDocument.price)}</span>
                )}
              </div>
              
              {!isFree && paymentMethod === "online" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium">₱0.00</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold">Total Amount</span>
                {isFree ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 text-lg px-3 py-1">
                      FREE
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <IconCurrencyPeso className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {selectedDocument.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Important:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Double-check all information before submitting</li>
                <li>You will receive email notifications on status updates</li>
                <li>Processing time may vary depending on the complexity</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <IconFileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Select a document type to see the summary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
