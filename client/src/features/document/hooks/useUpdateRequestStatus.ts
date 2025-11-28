import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequestStatus } from "../services/documentRequestService";
import { toast } from "sonner";
import type { UpdateStatusRequest } from "../types/documentRequest";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequest }) =>
      updateRequestStatus(id, data),
    onSuccess: (data) => {
      // Invalidate all document request queries
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      
      toast.success("Status Updated", {
        description: `Request ${data.trackingNumber} status has been updated to ${data.status}.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Update Status", {
        description: error?.response?.data?.message || "An error occurred while updating the status.",
      });
    },
  });
};
