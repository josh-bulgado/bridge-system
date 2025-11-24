import { useQuery } from "@tanstack/react-query";
import { verificationService } from "../services/verificationService";

/**
 * Hook to fetch resident verification status
 * Caches the result and provides loading/error states
 * @returns Verification status data with loading and error states
 */
export const useVerificationStatus = () => {
  return useQuery({
    queryKey: ["verificationStatus"],
    queryFn: verificationService.getVerificationStatus,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    retry: 1, // Only retry once on failure
  });
};
