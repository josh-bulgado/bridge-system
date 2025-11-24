import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveResident } from "../services/residentService";
import { toast } from "sonner";

export const useApproveResidentVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (residentId: string) => approveResident(residentId),
    onSuccess: (data, residentId) => {
      // Invalidate and refetch residents list
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      queryClient.invalidateQueries({ queryKey: ["resident", residentId] });
      
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
