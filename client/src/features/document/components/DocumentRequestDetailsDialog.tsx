import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
        <Clock className="h-4 w-4 text-muted-foreground" />
      );
    }
    
    // Documents tab icon
    const successStatuses = ["approved", "payment_verified", "processing", "ready_for_pickup", "completed"];
    if (successStatuses.includes(status)) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (status === "rejected") {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getTabTriggerBadge = (status: string, type: "payment" | "documents") => {
    if (type === "payment" && isPaymentVerified) {
      return (
        <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
          Verified
        </Badge>
      );
    }
    
    // Documents tab badges
    if (status === "approved") {
      return (
        <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
          Approved
        </Badge>
      );
    }
    if (status === "payment_verified") {
      return (
        <Badge variant="default" className="ml-auto bg-blue-600 text-[10px] px-1.5 py-0 h-5">
          Payment Verified
        </Badge>
      );
    }
    if (status === "processing") {
      return (
        <Badge variant="default" className="ml-auto bg-purple-600 text-[10px] px-1.5 py-0 h-5">
          Processing
        </Badge>
      );
    }
    if (status === "ready_for_pickup") {
      return (
        <Badge variant="default" className="ml-auto bg-indigo-600 text-[10px] px-1.5 py-0 h-5">
          Ready for Pickup
        </Badge>
      );
    }
    if (status === "completed") {
      return (
        <Badge variant="default" className="ml-auto bg-emerald-600 text-[10px] px-1.5 py-0 h-5">
          Completed
        </Badge>
      );
    }
    if (status === "rejected") {
      return (
        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0 h-5">
          Rejected
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-xl font-bold">Document Request Details</DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tracking Number:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">{request.trackingNumber}</code>
          </div>
        </DialogHeader>
        
        {/* Basic Request Information */}
        <div className="space-y-6">
          <DocumentRequestInfoCard request={request} />

          {/* Two-Step Verification Tabs (or single tab for walkin) */}
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            {!isWalkinPayment && (
              <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                <TabsTrigger 
                  value="payment"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
                >
                  {getTabTriggerIcon(request.status, "payment")}
                  <span>Payment Verification</span>
                  {getTabTriggerBadge(request.status, "payment")}
                </TabsTrigger>
                <TabsTrigger 
                  value="documents"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
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
