/**
 * Cash on Pickup (Walk-in) Payment Logic
 * 
 * Handles workflow logic for cash on pickup payments
 * 
 * Workflow:
 * 1. Submit request → "pending"
 * 2. Approve documents → "approved"
 * 3. Resident arrives, verify payment → "approved" (status stays same, paymentVerifiedAt is set)
 * 4. Generate document → "processing" → "ready_for_pickup"
 * 5. Complete → "completed"
 */

import type { DocumentRequest } from "../types/documentRequest";

/**
 * Check if this is a cash on pickup request
 */
export function isCashOnPickup(request: DocumentRequest): boolean {
  return request.paymentMethod === "walkin" && request.amount > 0;
}

/**
 * Check if payment is verified for cash on pickup
 */
export function isPaymentVerifiedForCashOnPickup(request: DocumentRequest): boolean {
  if (!isCashOnPickup(request)) {
    return false;
  }
  
  return request.paymentVerifiedAt !== undefined && request.paymentVerifiedAt !== null;
}

/**
 * Check if documents can be reviewed for cash on pickup
 * Documents can be reviewed immediately when status is "pending"
 */
export function canReviewCashOnPickupDocuments(request: DocumentRequest): boolean {
  if (!isCashOnPickup(request)) {
    return false;
  }
  
  return request.status === "pending" && !request.reviewedAt;
}

/**
 * Check if document can be generated for cash on pickup
 * Can generate when:
 * - Status is "approved" AND
 * - Payment is verified (paymentVerifiedAt is set)
 */
export function canGenerateCashOnPickupDocument(request: DocumentRequest): boolean {
  if (!isCashOnPickup(request)) {
    return false;
  }
  
  const isPaymentVerified = isPaymentVerifiedForCashOnPickup(request);
  
  return (request.status === "approved" && isPaymentVerified) || 
         request.status === "processing";
}

/**
 * Check if ready to collect payment (documents approved, payment not yet verified)
 */
export function isReadyForPaymentCollection(request: DocumentRequest): boolean {
  if (!isCashOnPickup(request)) {
    return false;
  }
  
  const isPaymentVerified = isPaymentVerifiedForCashOnPickup(request);
  
  return request.status === "approved" && !isPaymentVerified;
}

/**
 * Get the status message for cash on pickup
 */
export function getCashOnPickupStatusMessage(request: DocumentRequest): string {
  if (!isCashOnPickup(request)) {
    return "";
  }
  
  const isPaymentVerified = isPaymentVerifiedForCashOnPickup(request);
  
  if (request.status === "pending") {
    return "Cash on Pickup - Ready for Document Review";
  }
  
  if (request.status === "approved" && !isPaymentVerified) {
    return "Documents approved. Waiting for resident to arrive and pay.";
  }
  
  if (request.status === "approved" && isPaymentVerified) {
    return "Payment received and documents approved. You can now generate the official document.";
  }
  
  if (request.status === "processing") {
    return "Document is being generated.";
  }
  
  if (request.status === "ready_for_pickup") {
    return "Document is ready for pickup.";
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
 * Get payment tab message for cash on pickup
 */
export function getCashOnPickupPaymentMessage(request: DocumentRequest): {
  title: string;
  description: string;
} {
  if (!isCashOnPickup(request)) {
    return { title: "", description: "" };
  }
  
  const isPaymentVerified = isPaymentVerifiedForCashOnPickup(request);
  
  if (request.status === "approved" && !isPaymentVerified) {
    return {
      title: "Waiting for Resident",
      description: `The resident has been notified that their document is ready. They will come to the barangay hall to pay ₱${request.amount.toLocaleString()} in cash and pick up their document.`
    };
  }
  
  return {
    title: "Cash on Pickup Payment",
    description: "Payment will be collected when resident picks up the document"
  };
}
