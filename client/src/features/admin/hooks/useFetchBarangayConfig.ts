import { useQuery } from "@tanstack/react-query";
import { barangayConfigService } from "../services/configService";

/**
 * Hook to fetch barangay configuration
 */
export const useFetchBarangayConfig = () => {
  return useQuery({
    queryKey: ["barangayConfig"],
    queryFn: () => barangayConfigService.getBarangayConfig(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (no config found)
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });
};
