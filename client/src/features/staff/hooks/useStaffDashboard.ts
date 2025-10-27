import { useQuery } from '@tanstack/react-query';
import type { Request, StaffDashboardStats } from '../types';

// Mock API functions - replace with actual API calls
const fetchDashboardStats = async (): Promise<StaffDashboardStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalRequests: { count: 156, change: 12.5 },
    pendingReview: { count: 23, change: -5.2 },
    paymentVerification: { count: 18, change: 8.7 },
    readyForGeneration: { count: 12, change: 15.3 },
  };
};

const fetchRecentRequests = async (): Promise<Request[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      trackingNumber: 'REQ-2024-001',
      documentType: 'Barangay Clearance',
      residentName: 'Juan dela Cruz',
      purpose: 'Employment requirements',
      amount: 50,
      status: 'pending',
      submittedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      trackingNumber: 'REQ-2024-002',
      documentType: 'Certificate of Residency',
      residentName: 'Maria Santos',
      purpose: 'School enrollment',
      amount: 30,
      status: 'payment_pending',
      submittedAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      trackingNumber: 'REQ-2024-003',
      documentType: 'Certificate of Indigency',
      residentName: 'Pedro Garcia',
      purpose: 'Medical assistance',
      amount: 20,
      status: 'ready_for_generation',
      submittedAt: new Date('2024-01-13'),
    },
    {
      id: '4',
      trackingNumber: 'REQ-2024-004',
      documentType: 'Barangay Clearance',
      residentName: 'Ana Rodriguez',
      purpose: 'Business permit',
      amount: 50,
      status: 'approved',
      submittedAt: new Date('2024-01-12'),
    },
    {
      id: '5',
      trackingNumber: 'REQ-2024-005',
      documentType: 'Certificate of Residency',
      residentName: 'Carlos Mendoza',
      purpose: 'Bank account opening',
      amount: 30,
      status: 'pending',
      submittedAt: new Date('2024-01-11'),
    },
  ];
};

export const useStaffDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ['staff-dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const requestsQuery = useQuery({
    queryKey: ['staff-recent-requests'],
    queryFn: fetchRecentRequests,
  });

  return {
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,
    requests: requestsQuery.data || [],
    requestsLoading: requestsQuery.isLoading,
    requestsError: requestsQuery.error,
    refetch: () => {
      statsQuery.refetch();
      requestsQuery.refetch();
    },
  };
};