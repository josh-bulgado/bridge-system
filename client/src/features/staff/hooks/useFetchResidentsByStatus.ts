import { useQuery } from "@tanstack/react-query";
import { fetchResidentsByStatus } from "../../resident/services/residentService";

type VerificationStatus = "Pending" | "Approved" | "Rejected" | "Under Review";

/**
 * Hook to fetch residents by verification status
 */
export const useFetchResidentsByStatus = (status: VerificationStatus) => {
  return useQuery({
    queryKey: ["residents", "status", status],
    queryFn: () => fetchResidentsByStatus(status),
    enabled: !!status,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
