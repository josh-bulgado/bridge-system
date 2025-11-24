import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "../services/staffService";

/**
 * Hook to fetch all staff members
 */
export const useFetchStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
