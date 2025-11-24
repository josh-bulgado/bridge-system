import api from "@/lib/api";
import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  ToggleDocumentStatusRequest,
} from "../types/document";

/**
 * Fetch all documents
 */
export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await api.get("/document");
  return response.data;
};

/**
 * Fetch a single document by ID
 */
export const fetchDocumentById = async (id: string): Promise<Document> => {
  const response = await api.get(`/document/${id}`);
  return response.data;
};

/**
 * Create a new document
 */
export const createDocument = async (
  data: CreateDocumentRequest,
): Promise<Document> => {
  const response = await api.post("/document", data);
  return response.data;
};

/**
 * Update an existing document
 */
export const updateDocument = async (
  id: string,
  data: UpdateDocumentRequest,
): Promise<Document> => {
  const response = await api.put(`/document/${id}`, data);
  return response.data;
};

/**
 * Delete a document
 */
export const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/document/${id}`);
};

/**
 * Toggle document status (Activate/Deactivate)
 */
export const toggleDocumentStatus = async (
  id: string,
  data: ToggleDocumentStatusRequest,
): Promise<Document> => {
  const response = await api.patch(`/document/${id}/status`, data);
  return response.data;
};

/**
 * Duplicate a document
 */
export const duplicateDocument = async (id: string): Promise<Document> => {
  const response = await api.post(`/document/${id}/duplicate`);
  return response.data;
};

/**
 * Fetch active documents only
 */
export const fetchActiveDocuments = async (): Promise<Document[]> => {
  const response = await api.get("/document/active");
  return response.data;
};

/**
 * Search documents by name
 */
export const searchDocuments = async (query: string): Promise<Document[]> => {
  const response = await api.get("/document/search", {
    params: { query },
  });
  return response.data;
};
