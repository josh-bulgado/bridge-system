export type DocumentRequestStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'payment_pending' 
  | 'payment_verified' 
  | 'ready_for_generation' 
  | 'completed';

export type PaymentMethod = 'online' | 'walkin';

export interface StatusHistory {
  status: string;
  changedBy?: string;
  changedByName?: string;
  changedAt: string;
  reason?: string;
  notes?: string;
}

export interface DocumentRequest {
  id: string;
  trackingNumber: string;
  
  // Resident Information (populated)
  residentId: string;
  residentName: string;
  residentEmail: string;
  
  // Document Information (populated)
  documentId: string;
  documentType: string;
  
  // Request Details
  purpose: string;
  additionalDetails?: string;
  
  // Payment Information
  paymentMethod: PaymentMethod;
  amount: number;
  paymentProof?: string;
  paymentReferenceNumber?: string;
  supportingDocuments?: string[];
  paymentVerifiedBy?: string;
  paymentVerifiedByName?: string;
  paymentVerifiedAt?: string;
  
  // Status
  status: DocumentRequestStatus;
  statusHistory: StatusHistory[];
  
  // Review Information
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  notes?: string;
  
  // Document Generation
  generatedDocumentUrl?: string;
  generatedBy?: string;
  generatedByName?: string;
  generatedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

// Request DTOs
export interface CreateDocumentRequestRequest {
  residentId: string;
  documentId: string;
  purpose: string;
  additionalDetails?: string;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  paymentReferenceNumber?: string;
  supportingDocuments?: string[];
  createdBy?: string;
}

export interface ApproveDocumentRequestRequest {
  notes?: string;
}

export interface RejectDocumentRequestRequest {
  rejectionReason: string;
  notes?: string;
}

export interface VerifyPaymentRequest {
  notes?: string;
}

export interface UpdateStatusRequest {
  status: DocumentRequestStatus;
  reason?: string;
  notes?: string;
}
