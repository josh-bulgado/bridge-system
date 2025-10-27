export interface Request {
  id: string;
  trackingNumber: string;
  documentType: 'Barangay Clearance' | 'Certificate of Residency' | 'Certificate of Indigency';
  residentName: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'payment_pending' | 'ready_for_generation';
  submittedAt: Date;
}

export interface StaffDashboardStats {
  totalRequests: {
    count: number;
    change: number;
  };
  pendingReview: {
    count: number;
    change: number;
  };
  paymentVerification: {
    count: number;
    change: number;
  };
  readyForGeneration: {
    count: number;
    change: number;
  };
}

export interface StatCardData {
  title: string;
  count: number;
  change: number;
  theme: 'green' | 'orange' | 'purple' | 'blue';
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

// Re-export document types
export * from './document';