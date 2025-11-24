import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateResident,
  type UpdateResidentRequest,
} from "../../resident/services/residentService";
import { toast } from "sonner";

/**
 * Hook to update resident information
 */
export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResidentRequest }) =>
      updateResident(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      queryClient.invalidateQueries({ queryKey: ["resident", data.id] });
      toast.success("Resident updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update resident";
      toast.error(message);
    },
  });
};
