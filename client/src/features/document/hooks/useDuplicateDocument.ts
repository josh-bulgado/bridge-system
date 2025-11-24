import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { duplicateDocument } from "../services/documentService";

/**
 * Hook to duplicate a document
 */
export const useDuplicateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => duplicateDocument(id),
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document duplicated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to duplicate document. Please try again.";
      toast.error(message);
    },
  });
};
