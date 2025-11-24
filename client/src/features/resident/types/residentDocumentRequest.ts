// Re-export types from document feature for convenience
export type {
  DocumentRequest,
  DocumentRequestStatus,
  PaymentMethod,
  StatusHistory,
  CreateDocumentRequestRequest,
} from "@/features/document/types/documentRequest";

export type { Document } from "@/features/document/types/document";

// Resident-specific request interface for creating document requests
export interface ResidentCreateDocumentRequest {
  documentId: string;
  purpose: string;
  additionalDetails?: string;
  paymentMethod: "online" | "walkin";
  paymentProof?: string; // For GCash reference number
  supportingDocuments?: string[]; // URLs from file upload
}

// GCash payment info
export interface GCashPaymentInfo {
  gcashNumber?: string;
  gcashAccountName?: string;
  gcashQrCodeUrl?: string;
}

// Purpose options for document requests
export const PURPOSE_OPTIONS = [
  { value: "employment", label: "Employment" },
  { value: "school", label: "School Requirement" },
  { value: "government", label: "Government Transaction" },
  { value: "loan", label: "Loan Application" },
  { value: "business", label: "Business Registration" },
  { value: "travel", label: "Travel/Visa" },
  { value: "other", label: "Other (please specify)" },
] as const;

export type PurposeValue = typeof PURPOSE_OPTIONS[number]["value"];
