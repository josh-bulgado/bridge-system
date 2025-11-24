import { useQuery } from "@tanstack/react-query";
import { fetchActiveStaff } from "../services/staffService";

/**
 * Hook to fetch active staff only
 */
export const useFetchActiveStaff = () => {
  return useQuery({
    queryKey: ["staff", "active"],
    queryFn: fetchActiveStaff,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
