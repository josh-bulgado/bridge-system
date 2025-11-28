/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectDocumentRequest } from "../services/documentRequestService";
import { toast } from "sonner";
import type { RejectDocumentRequestRequest } from "../types/documentRequest";
import { CACHE_INVALIDATION, QUERY_KEYS } from "@/lib/cache-config";

export const useRejectDocumentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectDocumentRequestRequest }) =>
      rejectDocumentRequest(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentRequestDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.stats() });
      
      toast.success("Request Rejected", {
        description: `Request ${data.trackingNumber} has been rejected.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Reject Request", {
        description: error?.response?.data?.message || "An error occurred while rejecting the request.",
      });
    },
  });
};
