import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleStaffStatus } from "../services/staffService";
import type { ToggleStaffStatusRequest } from "../types/staff";
import type { AxiosError } from "axios";

/**
 * Hook to toggle staff status (Activate/Deactivate)
 */
export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ToggleStaffStatusRequest }) =>
      toggleStaffStatus(id, data),
    onSuccess: (updatedStaff) => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      // Invalidate the specific staff member
      queryClient.invalidateQueries({
        queryKey: ["staff", updatedStaff.id],
      });
      const status = updatedStaff.isActive ? "activated" : "deactivated";
      toast.success(`Staff member ${status} successfully!`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to update staff status. Please try again.";
      toast.error(message);
    },
  });
};
