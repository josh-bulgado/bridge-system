import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResidentDocumentRequest } from "../services/residentDocumentRequestService";
import type { CreateDocumentRequestRequest } from "@/features/document/types/documentRequest";
import { toast } from "sonner";

export const useCreateResidentDocumentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequestRequest) =>
      createResidentDocumentRequest(data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["myDocumentRequests"] });
      toast.success("Document request submitted successfully!", {
        description: `Tracking Number: ${data.trackingNumber}`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to submit document request", {
        description: error?.response?.data?.message || error.message,
      });
    },
  });
};
