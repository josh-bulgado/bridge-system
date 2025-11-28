import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { DocumentRequestInfoCard } from "./DocumentRequestInfoCard";
import { PaymentVerificationTab } from "./PaymentVerificationTab";
import { SupportingDocumentsTab } from "./SupportingDocumentsTab";
import type { DocumentRequest } from "../types/documentRequest";

interface DocumentRequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DocumentRequest;
  isPaymentVerified: boolean;
  isWalkinPayment: boolean;
  canReviewDocuments: boolean;
  canGenerate: boolean;
  isProcessing: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onApprovePayment: () => void;
  onRejectPayment: () => void;
  onApproveDocument: () => void;
  onRejectDocument: () => void;
  onGenerateDocument: () => void;
  onImagePreview: (url: string, title: string) => void;
}

export function DocumentRequestDetailsDialog({
  open,
  onOpenChange,
  request,
  isPaymentVerified,
  isWalkinPayment,
  canReviewDocuments,
  canGenerate,
  isProcessing,
  activeTab,
  onTabChange,
  onApprovePayment,
  onRejectPayment,
  onApproveDocument,
  onRejectDocument,
  onGenerateDocument,
  onImagePreview,
}: DocumentRequestDetailsDialogProps) {
  const getTabTriggerIcon = (status: string, type: "payment" | "documents") => {
    if (type === "payment") {
      return isPaymentVerified ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Clock className="text-muted-foreground h-4 w-4" />
      );
    }

    // Documents tab icon
    const successStatuses = [
      "approved",
      "payment_verified",
      "processing",
      "ready_for_pickup",
      "completed",
    ];
    if (successStatuses.includes(status)) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (status === "rejected") {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="text-muted-foreground h-4 w-4" />;
  };

  const getTabTriggerBadge = (
    status: string,
    type: "payment" | "documents",
  ) => {
    if (type === "payment" && isPaymentVerified) {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-green-600 px-1.5 py-0 text-[10px]"
        >
          Verified
        </Badge>
      );
    }

    // Documents tab badges
    if (status === "approved") {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-green-600 px-1.5 py-0 text-[10px]"
        >
          Approved
        </Badge>
      );
    }
    if (status === "payment_verified") {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-blue-600 px-1.5 py-0 text-[10px]"
        >
          Payment Verified
        </Badge>
      );
    }
    if (status === "processing") {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-purple-600 px-1.5 py-0 text-[10px]"
        >
          Processing
        </Badge>
      );
    }
    if (status === "ready_for_pickup") {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-indigo-600 px-1.5 py-0 text-[10px]"
        >
          Ready for Pickup
        </Badge>
      );
    }
    if (status === "completed") {
      return (
        <Badge
          variant="default"
          className="ml-auto h-5 bg-emerald-600 px-1.5 py-0 text-[10px]"
        >
          Completed
        </Badge>
      );
    }
    if (status === "rejected") {
      return (
        <Badge
          variant="destructive"
          className="ml-auto h-5 px-1.5 py-0 text-[10px]"
        >
          Rejected
        </Badge>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min max-w-6xl overflow-y-auto">
        <DialogHeader className="space-y-3 border-b pb-6">
          <DialogTitle className="text-xl font-bold">
            Document Request Details
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Tracking Number:
            </span>
            <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold">
              {request.trackingNumber}
            </code>
          </div>
        </DialogHeader>

        {/* Basic Request Information */}
        <div className="space-y-6">
          <DocumentRequestInfoCard request={request} />

          {/* Two-Step Verification Tabs (or single tab for walkin) */}
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            {!isWalkinPayment && (
              <TabsList className="bg-muted/50 grid h-auto w-full grid-cols-2 p-1">
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:bg-background gap-2 py-3 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                >
                  {getTabTriggerIcon(request.status, "payment")}
                  <span>Payment Verification</span>
                  {getTabTriggerBadge(request.status, "payment")}
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-background gap-2 py-3 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                >
                  {getTabTriggerIcon(request.status, "documents")}
                  <span>Supporting Documents</span>
                  {getTabTriggerBadge(request.status, "documents")}
                </TabsTrigger>
              </TabsList>
            )}

            {/* Tab 1: Payment Verification */}
            <TabsContent value="payment">
              <PaymentVerificationTab
                request={request}
                isPaymentVerified={isPaymentVerified}
                isProcessing={isProcessing}
                onApprovePayment={onApprovePayment}
                onRejectPayment={onRejectPayment}
                onImagePreview={onImagePreview}
              />
            </TabsContent>

            {/* Tab 2: Supporting Documents */}
            <TabsContent value="documents">
              <SupportingDocumentsTab
                request={request}
                canReviewDocuments={canReviewDocuments}
                canGenerate={canGenerate}
                isProcessing={isProcessing}
                onApproveDocument={onApproveDocument}
                onRejectDocument={onRejectDocument}
                onGenerateDocument={onGenerateDocument}
                onImagePreview={onImagePreview}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
