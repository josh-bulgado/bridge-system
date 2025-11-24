import { useQuery } from "@tanstack/react-query";
import { fetchGCashConfig } from "../services/residentDocumentRequestService";

/**
 * Hook to fetch GCash payment configuration
 */
export const useFetchGCashConfig = () => {
  return useQuery({
    queryKey: ["gcashConfig"],
    queryFn: fetchGCashConfig,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
