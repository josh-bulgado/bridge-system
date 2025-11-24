import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { barangayConfigService } from "../services/configService";
import type { BarangayConfigFormData } from "../schemas/barangayConfigSchema";
import type { AxiosError } from "axios";

/**
 * Hook to save (create or update) barangay configuration
 */
export const useSaveBarangayConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BarangayConfigFormData) => 
      barangayConfigService.saveBarangayConfig(data),
    onSuccess: () => {
      // Invalidate and refetch barangay config
      queryClient.invalidateQueries({ queryKey: ["barangayConfig"] });
      toast.success("Barangay configuration saved successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        "Failed to save barangay configuration. Please try again.";
      toast.error(message);
    },
  });
};
