import api from "@/lib/api";
import type {
  DocumentRequest,
  CreateDocumentRequestRequest,
  ApproveDocumentRequestRequest,
  RejectDocumentRequestRequest,
  VerifyPaymentRequest,
  UpdateStatusRequest,
} from "../types/documentRequest";

// Get all document requests with optional filters
export const fetchDocumentRequests = async (params?: {
  status?: string;
  residentId?: string;
  page?: number;
  pageSize?: number;
}): Promise<DocumentRequest[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append("status", params.status);
  if (params?.residentId) queryParams.append("residentId", params.residentId);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

  const response = await api.get<DocumentRequest[]>(
    `/document-requests${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  );
  return response.data;
};

// Get single document request by ID
export const fetchDocumentRequestById = async (
  id: string
): Promise<DocumentRequest> => {
  const response = await api.get<DocumentRequest>(`/document-requests/${id}`);
  return response.data;
};

// Get document request by tracking number
export const fetchDocumentRequestByTrackingNumber = async (
  trackingNumber: string
): Promise<DocumentRequest> => {
  const response = await api.get<DocumentRequest>(
    `/document-requests/tracking/${trackingNumber}`
  );
  return response.data;
};

// Create new document request
export const createDocumentRequest = async (
  data: CreateDocumentRequestRequest
): Promise<DocumentRequest> => {
  const response = await api.post<DocumentRequest>("/document-requests", data);
  return response.data;
};

// Approve document request
export const approveDocumentRequest = async (
  id: string,
  data: ApproveDocumentRequestRequest
): Promise<DocumentRequest> => {
  const response = await api.put<DocumentRequest>(
    `/document-requests/${id}/approve`,
    data
  );
  return response.data;
};

// Reject document request
export const rejectDocumentRequest = async (
  id: string,
  data: RejectDocumentRequestRequest
): Promise<DocumentRequest> => {
  const response = await api.put<DocumentRequest>(
    `/document-requests/${id}/reject`,
    data
  );
  return response.data;
};

// Verify payment
export const verifyPayment = async (
  id: string,
  data: VerifyPaymentRequest
): Promise<DocumentRequest> => {
  const response = await api.put<DocumentRequest>(
    `/document-requests/${id}/verify-payment`,
    data
  );
  return response.data;
};

// Update request status
export const updateRequestStatus = async (
  id: string,
  data: UpdateStatusRequest
): Promise<DocumentRequest> => {
  const response = await api.put<DocumentRequest>(
    `/document-requests/${id}/status`,
    data
  );
  return response.data;
};
