import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStaffRole } from "../services/staffService";
import type { UpdateStaffRoleRequest } from "../types/staff";
import type { AxiosError } from "axios";

/**
 * Hook to update staff role
 */
export const useUpdateStaffRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRoleRequest }) =>
      updateStaffRole(id, data),
    onSuccess: (updatedStaff) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      // Invalidate the specific staff member
      queryClient.invalidateQueries({
        queryKey: ["staff", updatedStaff.id],
      });
      toast.success("Staff role updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to update staff role. Please try again.";
      toast.error(message);
    },
  });
};
