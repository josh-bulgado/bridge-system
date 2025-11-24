import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectResident } from "../../resident/services/residentService";
import { toast } from "sonner";

/**
 * Hook to reject resident verification
 */
export const useRejectResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident verification rejected");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to reject resident";
      toast.error(message);
    },
  });
};
