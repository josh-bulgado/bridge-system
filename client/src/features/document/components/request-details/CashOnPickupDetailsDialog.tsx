/**
 * Cash on Pickup Request Details Dialog
 * 
 * Dialog for cash on pickup payments - Shows documents tab first, then payment tab
 * Documents can be reviewed immediately, payment is verified when resident arrives
 */

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
import { CheckCircle, Clock } from "lucide-react";
import { DocumentRequestInfoCard } from "../DocumentRequestInfoCard";
import { CashOnPickupPaymentTab } from "../payment-tabs";
import { CashOnPickupDocumentsTab } from "../document-tabs";
import type { DocumentRequest } from "../../types/documentRequest";

interface CashOnPickupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DocumentRequest;
  isPaymentVerified: boolean;
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

export function CashOnPickupDetailsDialog({
  open,
  onOpenChange,
  request,
  isPaymentVerified,
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
}: CashOnPickupDetailsDialogProps) {
  const getDocumentsTabBadge = () => {
    if (request.status === "approved") {
      return (
        <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
          Approved
        </Badge>
      );
    }
    if (request.status === "processing") {
      return (
        <Badge variant="default" className="ml-auto bg-purple-600 text-[10px] px-1.5 py-0 h-5">
          Processing
        </Badge>
      );
    }
    return null;
  };

  const getPaymentTabBadge = () => {
    if (isPaymentVerified) {
      return (
        <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
          Verified
        </Badge>
      );
    }
    if (request.status === "approved") {
      return (
        <Badge variant="secondary" className="ml-auto border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] px-1.5 py-0 h-5">
          Awaiting Payment
        </Badge>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-xl font-bold">
            Cash on Pickup - Document Request Details
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tracking Number:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">{request.trackingNumber}</code>
          </div>
        </DialogHeader>
        
        {/* Basic Request Information */}
        <div className="space-y-6">
          <DocumentRequestInfoCard request={request} />

          {/* Cash on Pickup: Documents First, Payment Second */}
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Supporting Documents</span>
                {getDocumentsTabBadge()}
              </TabsTrigger>
              <TabsTrigger 
                value="payment"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 gap-2 text-sm font-medium transition-all"
              >
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Payment Collection</span>
                {getPaymentTabBadge()}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Supporting Documents */}
            <TabsContent value="documents">
              <CashOnPickupDocumentsTab
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

            {/* Tab 2: Payment Collection */}
            <TabsContent value="payment">
              <CashOnPickupPaymentTab
                request={request}
                isPaymentVerified={isPaymentVerified}
                isProcessing={isProcessing}
                onApprovePayment={onApprovePayment}
                onRejectPayment={onRejectPayment}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
