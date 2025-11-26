import api from "@/lib/api";

export type GeneratePreviewResponse = {
  previewData: Record<string, string>;
  documentRequestId: string;
  residentName: string;
  documentType: string;
};

export type GenerateDocumentRequest = {
  data: Record<string, string>;
};

export type GenerateDocumentResponse = {
  documentUrl: string;
  trackingNumber: string;
  message: string;
};

const documentGenerationService = {
  /**
   * Generate preview data for document generation
   */
  async generatePreview(documentRequestId: string): Promise<GeneratePreviewResponse> {
    const response = await api.post<GeneratePreviewResponse>(
      `/document-requests/${documentRequestId}/generate-preview`
    );
    return response.data;
  },

  /**
   * Generate document from template with provided data
   */
  async generateDocument(
    documentRequestId: string,
    data: Record<string, string>
  ): Promise<GenerateDocumentResponse> {
    const response = await api.post<GenerateDocumentResponse>(
      `/document-requests/${documentRequestId}/generate-document`,
      { data }
    );
    return response.data;
  },
};

export default documentGenerationService;
