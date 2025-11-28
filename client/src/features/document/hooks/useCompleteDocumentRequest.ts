/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

interface CompleteDocumentRequestData {
  notes?: string;
}

export const useCompleteDocumentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CompleteDocumentRequestData;
    }) => {
      const response = await api.put(`/document-requests/${id}/complete`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      toast.success("Request marked as completed", {
        description: "The resident has successfully picked up their document.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to complete request";
      toast.error("Error", {
        description: errorMessage,
      });
    },
  });
};
