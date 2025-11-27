import { useQuery } from '@tanstack/react-query';
import { staffDashboardService } from '../services/staffDashboardService';
import { useFetchDocumentRequests } from '@/features/document/hooks/useFetchDocumentRequests';
import type { Request } from '../types';
import { useMemo } from 'react';

export const useStaffDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ['staff-dashboard-stats'],
    queryFn: staffDashboardService.getStats,
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: true,
  });

  // Fetch all document requests
  const { data: documentRequests, isLoading: requestsLoading, error: requestsError } = useFetchDocumentRequests({});

  // Transform document requests to match Request type
  const requests: Request[] = useMemo(() => {
    if (!documentRequests) return [];

    return documentRequests.map(req => ({
      id: req.id,
      trackingNumber: req.trackingNumber,
      documentType: req.documentType,
      residentName: req.residentName || 'Unknown Resident',
      purpose: req.purpose,
      amount: req.amount,
      status: req.status,
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
    refetch: () => {
      statsQuery.refetch();
    },
  };
};