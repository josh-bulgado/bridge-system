import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveDocumentRequest } from "../services/documentRequestService";
import { toast } from "sonner";
import type { ApproveDocumentRequestRequest } from "../types/documentRequest";
import { CACHE_INVALIDATION, QUERY_KEYS } from "@/lib/cache-config";

export const useApproveDocumentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveDocumentRequestRequest }) =>
      approveDocumentRequest(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentRequestDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.stats() });
      
      toast.success("Request Approved", {
        description: `Request ${data.trackingNumber} has been approved successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Approve Request", {
        description: error?.response?.data?.message || "An error occurred while approving the request.",
      });
    },
  });
};
