/**
 * GCash Request Details Dialog
 * 
 * Dialog for GCash/online payments - Shows documents tab first, then payment tab
 * Payment must be verified before documents can be reviewed
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
import { GCashPaymentTab } from "../payment-tabs";
import { GCashDocumentsTab } from "../document-tabs";
import type { DocumentRequest } from "../../types/documentRequest";

interface GCashDetailsDialogProps {
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

export function GCashDetailsDialog({
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
}: GCashDetailsDialogProps) {
  const getDocumentsTabBadge = () => {
    if (request.status === "payment_verified") {
      if (request.reviewedAt) {
        return (
          <Badge variant="default" className="ml-auto bg-green-600 text-[10px] px-1.5 py-0 h-5">
            Payment & Docs Approved
          </Badge>
        );
      }
      return (
        <Badge variant="default" className="ml-auto bg-blue-600 text-[10px] px-1.5 py-0 h-5">
          Payment Verified
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
    return (
      <Badge variant="secondary" className="ml-auto border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-[10px] px-1.5 py-0 h-5">
        Pending Verification
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-xl font-bold">
            GCash Payment - Document Request Details
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tracking Number:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">{request.trackingNumber}</code>
          </div>
        </DialogHeader>
        
        {/* Basic Request Information */}
        <div className="space-y-6">
          <DocumentRequestInfoCard request={request} />

          {/* GCash: Documents First, Payment Second */}
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
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Payment Verification</span>
                {getPaymentTabBadge()}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Supporting Documents */}
            <TabsContent value="documents">
              <GCashDocumentsTab
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

            {/* Tab 2: Payment Verification */}
            <TabsContent value="payment">
              <GCashPaymentTab
                request={request}
                isPaymentVerified={isPaymentVerified}
                isProcessing={isProcessing}
                onApprovePayment={onApprovePayment}
                onRejectPayment={onRejectPayment}
                onImagePreview={onImagePreview}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
