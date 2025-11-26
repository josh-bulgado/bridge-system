import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveResident } from "../../resident/services/residentService";
import { toast } from "sonner";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

/**
 * Hook to approve resident verification
 */
export const useApproveResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.residents() });
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.stats() });
      toast.success("Resident approved successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to approve resident";
      toast.error(message);
    },
  });
};
