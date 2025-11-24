import { useMemo } from "react";
import { useFetchDocumentRequests } from "@/features/document/hooks/useFetchDocumentRequests";

interface ResidentStats {
  totalRequests: number;
  actionRequired: number;
  readyForPickup: number;
  completed: number;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to fetch and calculate resident document request statistics
 * @param residentId - The ID of the resident
 * @returns Statistics object with counts for different request statuses
 */
export const useResidentStats = (residentId?: string): ResidentStats => {
  const { data: requests, isLoading, isError } = useFetchDocumentRequests({
    residentId,
  });

  const stats = useMemo(() => {
    if (!requests || requests.length === 0) {
      return {
        totalRequests: 0,
        actionRequired: 0,
        readyForPickup: 0,
        completed: 0,
      };
    }

    // Count requests by status
    const actionRequired = requests.filter(
      (req) => 
        req.status === "pending" || 
        req.status === "payment_pending" ||
        req.status === "payment_verified"
    ).length;

    const readyForPickup = requests.filter(
      (req) => req.status === "ready_for_generation"
    ).length;

    const completed = requests.filter(
      (req) => req.status === "completed"
    ).length;

    return {
      totalRequests: requests.length,
      actionRequired,
      readyForPickup,
      completed,
    };
  }, [requests]);

  return {
    ...stats,
    isLoading,
    isError,
  };
};
