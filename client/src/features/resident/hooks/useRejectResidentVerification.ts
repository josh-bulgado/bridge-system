/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectResident } from "../services/residentService";
import { toast } from "sonner";

interface RejectResidentParams {
  residentId: string;
  reason?: string;
}

export const useRejectResidentVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ residentId }: RejectResidentParams) => 
      rejectResident(residentId),
    onSuccess: ( { residentId }) => {
      // Invalidate and refetch residents list
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      queryClient.invalidateQueries({ queryKey: ["resident", residentId] });
      
      toast.success("Resident verification rejected");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject resident verification";
      toast.error(errorMessage);
    },
  });
};
