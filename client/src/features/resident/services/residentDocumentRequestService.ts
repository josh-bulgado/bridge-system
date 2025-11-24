import api from "@/lib/api";
import type {
  DocumentRequest,
  CreateDocumentRequestRequest,
} from "@/features/document/types/documentRequest";

/**
 * Get all document requests for the logged-in resident
 */
export const fetchMyDocumentRequests = async (params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<DocumentRequest[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

  const response = await api.get<DocumentRequest[]>(
    `/document-requests/my-requests${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  );
  return response.data;
};

/**
 * Create new document request by resident
 */
export const createResidentDocumentRequest = async (
  data: CreateDocumentRequestRequest
): Promise<DocumentRequest> => {
  const response = await api.post<DocumentRequest>("/document-requests/resident", data);
  return response.data;
};

/**
 * Get GCash payment configuration
 */
export interface GCashConfig {
  gcashNumber?: string;
  gcashAccountName?: string;
  gcashQrCodeUrl?: string;
}

export const fetchGCashConfig = async (): Promise<GCashConfig> => {
  const response = await api.get<GCashConfig>("/barangayconfig/gcash");
  return response.data;
};

/**
 * Fetch active documents available for request
 */
export const fetchAvailableDocuments = async () => {
  const response = await api.get("/document");
  // Filter only active documents
  return response.data.filter((doc: any) => doc.status === "Active");
};
