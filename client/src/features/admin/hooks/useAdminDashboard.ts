import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../services/adminDashboardService";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: adminDashboardService.getStats,
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: true,
  });
};
