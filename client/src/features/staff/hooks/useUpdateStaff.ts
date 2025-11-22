import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStaff } from "../services/staffService";
import type { UpdateStaffRequest } from "../types/staff";
import type { AxiosError } from "axios";

/**
 * Hook to update an existing staff member
 */
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) =>
      updateStaff(id, data),
    onSuccess: (updatedStaff) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      // Invalidate the specific staff member
      queryClient.invalidateQueries({
        queryKey: ["staff", updatedStaff.id],
      });
      toast.success("Staff member updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to update staff member. Please try again.";
      toast.error(message);
    },
  });
};
