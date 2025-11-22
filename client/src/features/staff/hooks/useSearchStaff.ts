import { useQuery } from "@tanstack/react-query";
import { searchStaff } from "../services/staffService";

/**
 * Hook to search staff by email
 */
export const useSearchStaff = (query: string) => {
  return useQuery({
    queryKey: ["staff", "search", query],
    queryFn: () => searchStaff(query),
    enabled: !!query && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
