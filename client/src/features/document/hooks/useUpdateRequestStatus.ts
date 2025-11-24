import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequestStatus } from "../services/documentRequestService";
import { toast } from "sonner";
import type { UpdateStatusRequest } from "../types/documentRequest";

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequest }) =>
      updateRequestStatus(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["documentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["documentRequest", data.id] });
      
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
