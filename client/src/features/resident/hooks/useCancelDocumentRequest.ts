import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

export function useCancelDocumentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.put(`/document-requests/${requestId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.stats() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    },
  });
}
