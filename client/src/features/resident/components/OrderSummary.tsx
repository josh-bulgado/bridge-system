import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconFileText, IconClock, IconCreditCard, IconCurrencyPeso } from "@tabler/icons-react";
import type { Document } from "@/features/document/types/document";

interface OrderSummaryProps {
  selectedDocument: Document | null;
  paymentMethod: "online" | "walkin";
  documentFormat?: "hardcopy" | "softcopy";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function OrderSummary({ selectedDocument, paymentMethod, documentFormat }: OrderSummaryProps) {
  const isFree = selectedDocument ? selectedDocument.price === 0 : false;

  return (
    <Card className="border-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Document Info */}
        {selectedDocument ? (
          <>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <IconFileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold leading-tight">{selectedDocument.name}</p>
                  {selectedDocument.requirements.length > 0 ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDocument.requirements.length} requirement(s)
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      No requirements needed
                    </p>
                  )}
                </div>
              </div>

              {/* Processing Time */}
              <div className="flex items-center gap-2.5 text-sm">
                <IconClock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Processing:</span>
                <span className="font-medium">{selectedDocument.processingTime}</span>
              </div>

              {/* Document Format - Show for all documents when format is selected */}
              {documentFormat && (
                <div className="flex items-center gap-2.5 text-sm">
                  <IconFileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Format:</span>
                  <Badge variant="secondary" className="font-medium">
                    {documentFormat === "hardcopy" 
                      ? "Hard Copy (Pick up)" 
                      : "Soft Copy (PDF)"}
                  </Badge>
                </div>
              )}

              {/* Payment Method - Only show if not free */}
              {!isFree && (
                <div className="flex items-center gap-2.5 text-sm">
                  <IconCreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Payment:</span>
                  <Badge variant="outline" className="font-medium">
                    {paymentMethod === "online" ? "GCash" : "Cash on Pickup"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Requirements - Only show if document has requirements */}
            {selectedDocument.requirements.length > 0 && (
              <>
                <Separator />

                <div className="space-y-2.5">
                  <p className="text-sm font-semibold">Requirements:</p>
                  <ul className="space-y-2">
                    {selectedDocument.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2.5">
                        <span className="text-primary text-base leading-none">•</span>
                        <span className="leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />
              </>
            )}

            {/* Price Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Document Fee</span>
                {isFree ? (
                  <Badge variant="secondary" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 font-semibold">
                    FREE
                  </Badge>
                ) : (
                  <span className="font-semibold">{formatCurrency(selectedDocument.price)}</span>
                )}
              </div>
              
              {!isFree && paymentMethod === "online" && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold">₱0.00</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">Total Amount</span>
                {isFree ? (
                  <Badge variant="secondary" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 text-lg px-3 py-1 font-bold">
                    FREE
                  </Badge>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <IconCurrencyPeso className="h-6 w-6 text-primary" />
                    <span className="text-3xl font-bold text-primary leading-none">
                      {selectedDocument.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground border border-muted/50">
              <p className="font-semibold mb-2 text-foreground">Important:</p>
              <ul className="space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-primary text-base leading-none">•</span>
                  <span>Double-check all information before submitting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary text-base leading-none">•</span>
                  <span>You will receive email notifications on status updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary text-base leading-none">•</span>
                  <span>Processing time may vary depending on the complexity</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
              <IconFileText className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Select a document type to see the summary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
