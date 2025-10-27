export interface PaymentRecord {
  id: string;
  paymentId: string;
  requestId: string;
  requesterName: string;
  documentType: string;
  amount: number;
  paymentMethod: 'GCash' | 'PayMaya' | 'Bank Transfer';
  status: 'pending_verification' | 'verified' | 'rejected';
  submittedAt: Date;
  verifiedAt?: Date;
  receiptUrl: string;
  referenceNumber?: string;
  rejectionReason?: string;
  verifiedBy?: string;
}

export interface PaymentStats {
  pendingVerification: number;
  verifiedToday: number;
  totalAmount: number;
}

export interface RejectionReason {
  value: string;
  label: string;
  requiresNote?: boolean;
}

export const rejectionReasons: RejectionReason[] = [
  { value: 'amount_mismatch', label: "Amount doesn't match" },
  { value: 'missing_reference', label: 'Reference number missing' },
  { value: 'fake_screenshot', label: 'Fake/edited screenshot' },
  { value: 'wrong_recipient', label: 'Wrong recipient' },
  { value: 'other', label: 'Other', requiresNote: true },
];