import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStaff } from "../services/staffService";
import type { CreateStaffRequest } from "../types/staff";
import type { AxiosError } from "axios";

/**
 * Hook to create a new staff member
 */
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffRequest) => createStaff(data),
    onSuccess: () => {
      // Invalidate and refetch staff
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member created successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to create staff member. Please try again.";
      toast.error(message);
    },
  });
};
