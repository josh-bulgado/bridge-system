import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPayment } from "../services/documentRequestService";
import { toast } from "sonner";
import type { VerifyPaymentRequest } from "../types/documentRequest";
import { CACHE_INVALIDATION } from "@/lib/cache-config";

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyPaymentRequest }) =>
      verifyPayment(id, data),
    onSuccess: (data) => {
      // Invalidate all document request queries
      queryClient.invalidateQueries({ queryKey: CACHE_INVALIDATION.documentRequests() });
      
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
