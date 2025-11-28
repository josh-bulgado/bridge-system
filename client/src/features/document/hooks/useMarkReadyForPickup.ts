import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { DocumentRequest } from "../types/documentRequest";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

export function useMarkReadyForPickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await api.put<DocumentRequest>(
        `/api/document-requests/${requestId}/ready-for-pickup`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      toast.success("Document marked as ready for pickup");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
}
