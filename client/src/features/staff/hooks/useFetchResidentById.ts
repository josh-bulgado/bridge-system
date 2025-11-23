import { useQuery } from "@tanstack/react-query";
import { fetchResidentById } from "../../resident/services/residentService";

/**
 * Hook to fetch a single resident by ID
 */
export const useFetchResidentById = (id: string) => {
  return useQuery({
    queryKey: ["resident", id],
    queryFn: () => fetchResidentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
