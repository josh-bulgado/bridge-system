import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStaff } from "../services/staffService";
import type { AxiosError } from "axios";

/**
 * Hook to delete a staff member
 */
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => {
      // Invalidate and refetch staff
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member deleted successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete staff member. Please try again.";
      toast.error(message);
    },
  });
};
