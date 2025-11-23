export interface DocumentRequest {
  id: string;
  trackingNumber: string;
  documentType: string;
  residentName: string;
  residentEmail: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_verified' | 'ready_for_generation' | 'completed';
  submittedAt: string;
  updatedAt: string;
  createdAt: string;
  rejectionReason?: string;
  notes?: string;
}

export interface UpdateDocumentRequestStatusRequest {
  status: DocumentRequest['status'];
  rejectionReason?: string;
  notes?: string;
}
