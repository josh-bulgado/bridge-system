/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveResident } from "../services/residentService";
import { toast } from "sonner";
import { CACHE_INVALIDATION, QUERY_KEYS } from "@/lib/cache-config";

export const useApproveResidentVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (residentId: string) => approveResident(residentId),
    onSuccess: (residentId) => {
      // Invalidate and refetch residents list
      queryClient.invalidateQueries({
        queryKey: CACHE_INVALIDATION.residents(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.residentDetail(residentId),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.stats() });

      toast.success("Resident verification approved successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to approve resident verification";
      toast.error(errorMessage);
    },
  });
};
