import { useQuery } from "@tanstack/react-query";
import { fetchResidents } from "../../resident/services/residentService";

/**
 * Hook to fetch all residents
 */
export const useFetchResidents = () => {
  return useQuery({
    queryKey: ["residents"],
    queryFn: fetchResidents,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
