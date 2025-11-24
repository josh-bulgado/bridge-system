import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveResident } from "../../resident/services/residentService";
import { toast } from "sonner";

/**
 * Hook to approve resident verification
 */
export const useApproveResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident approved successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to approve resident";
      toast.error(message);
    },
  });
};
