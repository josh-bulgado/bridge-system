/**
 * Payment Method Logic Utilities
 * 
 * This file contains logic for determining document request workflow
 * based on different payment methods (Free, Cash on Pickup, GCash)
 */

import type { DocumentRequest } from "../types/documentRequest";

export interface PaymentMethodChecks {
  isFreeDocument: boolean;
  isWalkinPayment: boolean;
  isOnlinePayment: boolean;
  isPaymentVerified: boolean;
}

/**
 * Determine payment method characteristics
 */
export function getPaymentMethodChecks(request: DocumentRequest): PaymentMethodChecks {
  const isFreeDocument = request.amount === 0;
  const isWalkinPayment = request.paymentMethod === "walkin";
  const isOnlinePayment = request.paymentMethod === "online";
  const isPaymentVerified = 
    request.paymentVerifiedAt !== undefined && 
    request.paymentVerifiedAt !== null;

  return {
    isFreeDocument,
    isWalkinPayment,
    isOnlinePayment,
    isPaymentVerified,
  };
}

/**
 * Check if documents can be reviewed based on payment method
 */
export function canReviewDocuments(request: DocumentRequest): boolean {
  const { isFreeDocument, isWalkinPayment, isOnlinePayment } = getPaymentMethodChecks(request);
  
  // Free documents: Can review immediately when pending
  if (isFreeDocument && request.status === "pending" && !request.reviewedAt) {
    return true;
  }
  
  // Cash on pickup: Can review immediately when pending
  if (isWalkinPayment && request.status === "pending" && !request.reviewedAt) {
    return true;
  }
  
  // GCash/Online: Can only review after payment is verified
  if (isOnlinePayment && request.status === "payment_verified" && !request.reviewedAt) {
    return true;
  }
  
  return false;
}

/**
 * Check if document can be generated based on payment method
 */
export function canGenerateDocument(request: DocumentRequest): boolean {
  const { isFreeDocument, isWalkinPayment, isOnlinePayment, isPaymentVerified } = 
    getPaymentMethodChecks(request);
  
  // Already in processing state - always allow
  if (request.status === "processing") {
    return true;
  }
  
  // Free documents: Allow when status is "approved"
  if (isFreeDocument && request.status === "approved") {
    return true;
  }
  
  // Cash on pickup: Allow when status is "approved" AND payment is verified
  if (isWalkinPayment && request.status === "approved" && isPaymentVerified) {
    return true;
  }
  
  // GCash/Online: Allow when status is "payment_verified" AND documents are reviewed
  if (isOnlinePayment && 
      request.status === "payment_verified" && 
      request.reviewedAt !== null && 
      request.reviewedAt !== undefined) {
    return true;
  }
  
  return false;
}

/**
 * Get the appropriate tab to show when opening request details
 */
export function getInitialTab(request: DocumentRequest): "payment" | "documents" {
  const { isFreeDocument, isWalkinPayment, isPaymentVerified } = getPaymentMethodChecks(request);
  
  // Free documents: Always go to documents tab (no payment tab)
  if (isFreeDocument) {
    return "documents";
  }
  
  // Pending status
  if (request.status === "pending") {
    // Walk-in: Show documents tab (can review docs immediately)
    // Online: Show payment tab (payment must be verified first)
    return isWalkinPayment ? "documents" : "payment";
  }
  
  // Approved status without payment verified
  if (request.status === "approved" && !isPaymentVerified) {
    return "payment";
  }
  
  // All other cases: Show documents tab
  return "documents";
}

/**
 * Check if payment tab should be shown
 */
export function shouldShowPaymentTab(request: DocumentRequest): boolean {
  const { isFreeDocument } = getPaymentMethodChecks(request);
  return !isFreeDocument;
}
