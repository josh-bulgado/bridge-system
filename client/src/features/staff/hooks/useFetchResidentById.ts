import { useQuery } from "@tanstack/react-query";
import { fetchResidentById } from "../../resident/services/residentService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

/**
 * Hook to fetch a single resident by ID
 * Uses longer cache for individual resident details
 */
export const useFetchResidentById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.residentDetail(id),
    queryFn: () => fetchResidentById(id),
    enabled: !!id,
    staleTime: CACHE_STRATEGIES.RESIDENT_DETAIL.staleTime,
    gcTime: CACHE_STRATEGIES.RESIDENT_DETAIL.gcTime,
  });
};
