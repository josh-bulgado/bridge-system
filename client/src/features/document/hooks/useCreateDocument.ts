import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDocument } from "../services/documentService";
import type { CreateDocumentRequest } from "../types/document";
import type { AxiosError } from "axios";

/**
 * Hook to create a new document
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) => createDocument(data),
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document created successfully!");
    },
    onError: (error: AxiosError) => {
      const message = error || "Failed to create document. Please try again.";
      toast.error(message.message);
    },
  });
};
