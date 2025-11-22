import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleDocumentStatus } from "../services/documentService";
import type { ToggleDocumentStatusRequest } from "../types/document";

/**
 * Hook to toggle document status (Activate/Deactivate)
 */
export const useToggleDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ToggleDocumentStatusRequest;
    }) => toggleDocumentStatus(id, data),
    onSuccess: (updatedDocument) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      // Invalidate the specific document
      queryClient.invalidateQueries({
        queryKey: ["document", updatedDocument.id],
      });
      
      const statusMessage =
        updatedDocument.status === "Active" ? "activated" : "deactivated";
      toast.success(`Document ${statusMessage} successfully!`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to toggle document status. Please try again.";
      toast.error(message);
    },
  });
};
