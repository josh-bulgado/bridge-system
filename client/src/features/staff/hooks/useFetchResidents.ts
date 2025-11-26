import { useQuery } from "@tanstack/react-query";
import { fetchResidents } from "../../resident/services/residentService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

/**
 * Hook to fetch all residents
 * Uses centralized cache configuration for consistency
 */
export const useFetchResidents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.residentList(),
    queryFn: fetchResidents,
    staleTime: CACHE_STRATEGIES.RESIDENTS.staleTime,
    gcTime: CACHE_STRATEGIES.RESIDENTS.gcTime,
  });
};
