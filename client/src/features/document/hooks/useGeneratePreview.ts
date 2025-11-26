import { useMutation } from "@tanstack/react-query";
import documentGenerationService from "../services/documentGenerationService";
import type { GeneratePreviewResponse } from "../services/documentGenerationService";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useGeneratePreview = () => {
  return useMutation<GeneratePreviewResponse, AxiosError, string>({
    mutationFn: (documentRequestId: string) =>
      documentGenerationService.generatePreview(documentRequestId),
    onError: (error: AxiosError<any>) => {
      const message = error.response?.data?.message || error.message || "Failed to generate preview";
      console.error("Preview generation error:", { error, message });
      toast.error(message);
    },
  });
};
