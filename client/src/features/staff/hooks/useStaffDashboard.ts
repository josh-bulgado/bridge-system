import { useQuery } from '@tanstack/react-query';
import { staffDashboardService } from '../services/staffDashboardService';
import { useFetchDocumentRequests } from '@/features/document/hooks/useFetchDocumentRequests';
import type { Request } from '../types';
import { useMemo } from 'react';

export const useStaffDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ['staff-dashboard-stats'],
    queryFn: staffDashboardService.getStats,
    staleTime: 30000, // Cache for 30 seconds (reduced for more frequent updates)
    refetchInterval: 30000, // Auto-refetch every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Fetch all document requests with auto-refresh
  const { data: documentRequests, isLoading: requestsLoading, error: requestsError } = useFetchDocumentRequests({
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });

  // Transform document requests to match Request type
  const requests: Request[] = useMemo(() => {
    if (!documentRequests) return [];

    return documentRequests.map(req => ({
      id: req.id,
      trackingNumber: req.trackingNumber,
      documentType: req.documentType as 'Barangay Clearance' | 'Certificate of Residency' | 'Certificate of Indigency',
      residentName: req.residentName || 'Unknown Resident',
      purpose: req.purpose,
      amount: req.amount,
      status: req.status as 'pending' | 'approved' | 'payment_pending' | 'ready_for_generation',
      submittedAt: new Date(req.submittedAt || req.createdAt),
    }));
  }, [documentRequests]);

  return {
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,
    requests,
    requestsLoading,
    requestsError,
    refetch: async () => {
      await Promise.all([
        statsQuery.refetch(),
        // Refetch is handled by the hook automatically
      ]);
    },
  };
};