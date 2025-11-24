import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDocument } from "../services/documentService";

/**
 * Hook to delete a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete document. Please try again.";
      toast.error(message);
    },
  });
};
