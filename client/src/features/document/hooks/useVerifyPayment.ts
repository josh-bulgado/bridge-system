import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPayment } from "../services/documentRequestService";
import { toast } from "sonner";
import type { VerifyPaymentRequest } from "../types/documentRequest";

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyPaymentRequest }) =>
      verifyPayment(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["documentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["documentRequest", data.id] });
      
      toast.success("Payment Verified", {
        description: `Payment for request ${data.trackingNumber} has been verified.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Verify Payment", {
        description: error?.response?.data?.message || "An error occurred while verifying the payment.",
      });
    },
  });
};
