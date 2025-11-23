import { useQuery } from "@tanstack/react-query";
import { searchResidents } from "../../resident/services/residentService";

/**
 * Hook to search residents by query
 */
export const useSearchResidents = (query: string) => {
  return useQuery({
    queryKey: ["residents", "search", query],
    queryFn: () => searchResidents(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
