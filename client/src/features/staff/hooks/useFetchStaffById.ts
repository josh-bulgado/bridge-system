import { useQuery } from "@tanstack/react-query";
import { fetchStaffById } from "../services/staffService";

/**
 * Hook to fetch a single staff member by ID
 */
export const useFetchStaffById = (id: string) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => fetchStaffById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
