/**
 * GCash (Online Payment) Logic
 * 
 * Handles workflow logic for GCash/online payments
 * 
 * Workflow:
 * 1. Submit request with payment proof → "pending"
 * 2. Verify payment → "payment_verified"
 * 3. Approve documents → "payment_verified" (status stays same, reviewedAt is set)
 * 4. Generate document → "processing" → "ready_for_pickup"
 * 5. Complete → "completed"
 */

import type { DocumentRequest } from "../types/documentRequest";

/**
 * Check if this is a GCash/online payment request
 */
export function isGCashOnlinePayment(request: DocumentRequest): boolean {
  return request.paymentMethod === "online" && request.amount > 0;
}

/**
 * Check if payment is verified for GCash
 */
export function isPaymentVerifiedForGCash(request: DocumentRequest): boolean {
  if (!isGCashOnlinePayment(request)) {
    return false;
  }
  
  return request.paymentVerifiedAt !== undefined && request.paymentVerifiedAt !== null;
}

/**
 * Check if documents can be reviewed for GCash
 * Documents can only be reviewed after payment is verified
 */
export function canReviewGCashDocuments(request: DocumentRequest): boolean {
  if (!isGCashOnlinePayment(request)) {
    return false;
  }
  
  return request.status === "payment_verified" && !request.reviewedAt;
}

/**
 * Check if document can be generated for GCash
 * Can generate when:
 * - Status is "payment_verified" AND
 * - Documents are reviewed (reviewedAt is set)
 */
export function canGenerateGCashDocument(request: DocumentRequest): boolean {
  if (!isGCashOnlinePayment(request)) {
    return false;
  }
  
  return (request.status === "payment_verified" && 
          request.reviewedAt !== null && 
          request.reviewedAt !== undefined) ||
         request.status === "processing";
}

/**
 * Check if payment needs verification
 */
export function needsPaymentVerification(request: DocumentRequest): boolean {
  if (!isGCashOnlinePayment(request)) {
    return false;
  }
  
  const isPaymentVerified = isPaymentVerifiedForGCash(request);
  
  return request.status === "pending" && !isPaymentVerified;
}

/**
 * Check if documents are blocked (waiting for payment verification)
 */
export function areDocumentsBlocked(request: DocumentRequest): boolean {
  if (!isGCashOnlinePayment(request)) {
    return false;
  }
  
  const isPaymentVerified = isPaymentVerifiedForGCash(request);
  
  return !isPaymentVerified;
}

/**
 * Get the status message for GCash
 */
export function getGCashStatusMessage(request: DocumentRequest): string {
  if (!isGCashOnlinePayment(request)) {
    return "";
  }
  
  const isPaymentVerified = isPaymentVerifiedForGCash(request);
  
  if (request.status === "pending" && !isPaymentVerified) {
    return "Pending payment verification. Please verify the payment first.";
  }
  
  if (request.status === "payment_verified" && !request.reviewedAt) {
    return "Payment verified. Ready for document review.";
  }
  
  if (request.status === "payment_verified" && request.reviewedAt) {
    return "Payment verified and documents approved. You can now generate the official document.";
  }
  
  if (request.status === "processing") {
    return "Document is being generated.";
  }
  
  if (request.status === "ready_for_pickup") {
    return request.documentFormat === "softcopy" 
      ? "Document is ready for download." 
      : "Document is ready for pickup.";
  }
  
  if (request.status === "completed") {
    return "Request completed.";
  }
  
  if (request.status === "rejected") {
    return "Request was rejected.";
  }
  
  return "";
}

/**
 * Get payment tab message for GCash
 */
export function getGCashPaymentMessage(request: DocumentRequest): {
  title: string;
  description: string;
} {
  if (!isGCashOnlinePayment(request)) {
    return { title: "", description: "" };
  }
  
  const isPaymentVerified = isPaymentVerifiedForGCash(request);
  
  if (isPaymentVerified) {
    return {
      title: "GCash Payment Verified",
      description: "Payment has been successfully verified. You can now proceed to review the supporting documents."
    };
  }
  
  return {
    title: "GCash Payment",
    description: "Review and verify the payment details below"
  };
}

/**
 * Get document review block message for GCash
 */
export function getGCashDocumentBlockMessage(request: DocumentRequest): string {
  if (!isGCashOnlinePayment(request)) {
    return "";
  }
  
  const isPaymentVerified = isPaymentVerifiedForGCash(request);
  
  if (!isPaymentVerified) {
    return "Please verify the payment first before reviewing documents";
  }
  
  return "";
}
