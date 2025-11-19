import api from "@/lib/api";

export interface DocumentRequest {
  id: string;
  requestNumber: string;
  userId: string;
  residentId: string;
  documentType: string;
  purpose: string;
  quantity: number;
  status: string;
  statusHistory: StatusHistory[];
  paymentRequired: boolean;
  paymentAmount?: number;
  paymentStatus: string;
  paymentProofUrl?: string;
  requiredDocuments?: string[];
  uploadedDocuments?: UploadedDocument[];
  assignedTo?: string;
  processedBy?: string;
  processedAt?: string;
  notes?: string;
  rejectionReason?: string;
  pickupSchedule?: string;
  pickedUpAt?: string;
  pickedUpBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  status: string;
  changedBy?: string;
  changedAt: string;
  comment?: string;
}

export interface UploadedDocument {
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  code: string;
  category: string;
  basePrice: number;
  processingTime: number;
  requiredDocuments: string[];
  isActive: boolean;
  requiresVerification: boolean;
}

export interface RequestStatistics {
  totalRequests: number;
  pendingRequests: number;
  processingRequests: number;
  actionRequiredRequests: number;
  readyForPickupRequests: number;
  completedRequests: number;
  rejectedRequests: number;
}

export interface CreateDocumentRequestDto {
  documentType: string;
  purpose: string;
  quantity?: number;
}

const documentRequestService = {
  // Get all requests for current user
  getMyRequests: async (): Promise<DocumentRequest[]> => {
    const response = await api.get("/api/DocumentRequest/my-requests");
    return response.data;
  },

  // Get request by ID
  getRequestById: async (id: string): Promise<DocumentRequest> => {
    const response = await api.get(`/api/DocumentRequest/${id}`);
    return response.data;
  },

  // Get statistics for current user
  getMyStatistics: async (): Promise<RequestStatistics> => {
    const response = await api.get("/api/DocumentRequest/my-statistics");
    return response.data;
  },

  // Create new request
  createRequest: async (data: CreateDocumentRequestDto): Promise<DocumentRequest> => {
    const response = await api.post("/api/DocumentRequest", data);
    return response.data;
  },

  // Get all active document types
  getActiveDocumentTypes: async (): Promise<DocumentType[]> => {
    const response = await api.get("/api/DocumentType/active");
    return response.data;
  },

  // Get document types by category
  getDocumentTypesByCategory: async (category: string): Promise<DocumentType[]> => {
    const response = await api.get(`/api/DocumentType/category/${category}`);
    return response.data;
  },
};

export default documentRequestService;
