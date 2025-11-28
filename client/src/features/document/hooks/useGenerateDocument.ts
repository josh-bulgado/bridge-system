import { useMutation, useQueryClient } from "@tanstack/react-query";
import documentGenerationService from "../services/documentGenerationService";
import type { GenerateDocumentResponse } from "../services/documentGenerationService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

interface GenerateDocumentParams {
  documentRequestId: string;
  data: Record<string, string>;
}

export const useGenerateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateDocumentResponse, AxiosError, GenerateDocumentParams>({
    mutationFn: ({ documentRequestId, data }) =>
      documentGenerationService.generateDocument(documentRequestId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Document generated successfully");
      // Invalidate all document request queries (list, detail, my requests)
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
    },
    onError: (error: AxiosError<any>) => {
      const message = error.response?.data?.message || error.message || "Failed to generate document";
      console.error("Document generation error:", { error, message });
      toast.error(message);
    },
  });
};
