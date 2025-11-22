import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDocument } from "../services/documentService";
import type { UpdateDocumentRequest } from "../types/document";

/**
 * Hook to update an existing document
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      updateDocument(id, data),
    onSuccess: (updatedDocument) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      // Invalidate the specific document
      queryClient.invalidateQueries({
        queryKey: ["document", updatedDocument.id],
      });
      toast.success("Document updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to update document. Please try again.";
      toast.error(message);
    },
  });
};
