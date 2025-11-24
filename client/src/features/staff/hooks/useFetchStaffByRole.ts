import { useQuery } from "@tanstack/react-query";
import { fetchStaffByRole } from "../services/staffService";

/**
 * Hook to fetch staff by role
 */
export const useFetchStaffByRole = (role: "admin" | "staff") => {
  return useQuery({
    queryKey: ["staff", "role", role],
    queryFn: () => fetchStaffByRole(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
