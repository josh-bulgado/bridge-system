import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResident } from "../../resident/services/residentService";
import { toast } from "sonner";

/**
 * Hook to delete a resident
 */
export const useDeleteResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete resident";
      toast.error(message);
    },
  });
};
