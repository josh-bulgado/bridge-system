export interface DocumentRequest {
  id: string;
  trackingNumber: string;
  documentType: 'Barangay Clearance' | 'Certificate of Residency' | 'Certificate of Indigency';
  residentName: string;
  purpose: string;
  amount: number;
  approvalDate: Date;
  preferredDelivery: 'digital' | 'physical';
  status: 'ready_for_release';
}

export interface GeneratedDocument {
  id: string;
  documentId: string;
  trackingNumber: string;
  documentType: string;
  residentName: string;
  generatedAt: Date;
  deliveryMethod: 'digital' | 'physical';
  status: 'completed' | 'ready_for_pickup' | 'claimed';
  downloadCount?: number;
  claimedAt?: Date;
  claimedBy?: string;
}

export interface DocumentGenerationStats {
  readyForRelease: {
    count: number;
    change: number;
  };
  generatedToday: {
    count: number;
    change: number;
  };
  digitalDownloads: {
    count: number;
    change: number;
  };
}

export interface ClaimVerification {
  validIdPresented: string;
  claimerType: 'requester' | 'representative';
  claimerName?: string;
  relationship?: string;
  authorizationLetter?: File;
  staffNotes?: string;
  identityVerified: boolean;
  staffName: string;
  claimedAt: Date;
}