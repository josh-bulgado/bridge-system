/**
 * Free Documents Logic
 * 
 * Handles workflow logic for free documents (amount = 0)
 * 
 * Workflow:
 * 1. Submit request → "pending"
 * 2. Approve documents → "approved"
 * 3. Generate document → "processing" → "ready_for_pickup"
 * 4. Complete → "completed"
 */

import type { DocumentRequest } from "../types/documentRequest";

/**
 * Check if this is a free document request
 */
export function isFreeDocument(request: DocumentRequest): boolean {
  return request.amount === 0;
}

/**
 * Check if documents can be reviewed for free documents
 * Free documents can be reviewed immediately when status is "pending"
 */
export function canReviewFreeDocuments(request: DocumentRequest): boolean {
  if (!isFreeDocument(request)) {
    return false;
  }
  
  return request.status === "pending" && !request.reviewedAt;
}

/**
 * Check if document can be generated for free documents
 * Free documents can be generated when status is "approved"
 */
export function canGenerateFreeDocument(request: DocumentRequest): boolean {
  if (!isFreeDocument(request)) {
    return false;
  }
  
  return request.status === "approved" || request.status === "processing";
}

/**
 * Get the status message for free documents
 */
export function getFreeDocumentStatusMessage(request: DocumentRequest): string {
  if (!isFreeDocument(request)) {
    return "";
  }
  
  switch (request.status) {
    case "pending":
      return "This is a free document. You can proceed to review the supporting documents.";
    case "approved":
      return "Documents approved. You can now generate the official document.";
    case "processing":
      return "Document is being generated.";
    case "ready_for_pickup":
      return "Document is ready for pickup/download.";
    case "completed":
      return "Request completed.";
    case "rejected":
      return "Request was rejected.";
    default:
      return "";
  }
}
