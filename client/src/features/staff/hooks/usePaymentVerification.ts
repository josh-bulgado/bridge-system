import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaymentRecord, PaymentStats } from '../types/payment';

// Mock API functions - replace with actual API calls
const fetchPaymentStats = async (): Promise<PaymentStats> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    pendingVerification: 15,
    verifiedToday: 23,
    totalAmount: 45750,
  };
};

const fetchPayments = async (): Promise<PaymentRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock payment data
  const baseDate = new Date();
  return [
    {
      id: '1',
      paymentId: 'PAY-2024-001',
      requestId: 'REQ-2024-001',
      requesterName: 'Juan dela Cruz',
      documentType: 'Barangay Clearance',
      amount: 50,
      paymentMethod: 'GCash',
      status: 'pending_verification',
      submittedAt: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      referenceNumber: '1234567890123',
    },
    {
      id: '2',
      paymentId: 'PAY-2024-002',
      requestId: 'REQ-2024-002',
      requesterName: 'Maria Santos',
      documentType: 'Certificate of Residency',
      amount: 30,
      paymentMethod: 'GCash',
      status: 'pending_verification',
      submittedAt: new Date(baseDate.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      referenceNumber: '9876543210987',
    },
    {
      id: '3',
      paymentId: 'PAY-2024-003',
      requestId: 'REQ-2024-003',
      requesterName: 'Pedro Garcia',
      documentType: 'Certificate of Indigency',
      amount: 20,
      paymentMethod: 'GCash',
      status: 'verified',
      submittedAt: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      verifiedAt: new Date(baseDate.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      referenceNumber: '5555666677778',
      verifiedBy: 'Staff User',
    },
    {
      id: '4',
      paymentId: 'PAY-2024-004',
      requestId: 'REQ-2024-004',
      requesterName: 'Ana Rodriguez',
      documentType: 'Business Permit',
      amount: 100,
      paymentMethod: 'GCash',
      status: 'pending_verification',
      submittedAt: new Date(baseDate.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
    },
    {
      id: '5',
      paymentId: 'PAY-2024-005',
      requestId: 'REQ-2024-005',
      requesterName: 'Carlos Mendoza',
      documentType: 'Barangay Clearance',
      amount: 50,
      paymentMethod: 'GCash',
      status: 'rejected',
      submittedAt: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      rejectionReason: "Amount doesn't match",
    },
    {
      id: '6',
      paymentId: 'PAY-2024-006',
      requestId: 'REQ-2024-006',
      requesterName: 'Lisa Chen',
      documentType: 'Certificate of Residency',
      amount: 30,
      paymentMethod: 'GCash',
      status: 'verified',
      submittedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      verifiedAt: new Date(baseDate.getTime() - 20 * 60 * 60 * 1000), // 20 hours ago
      receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      referenceNumber: '1111222233334',
      verifiedBy: 'Staff User',
    },
  ];
};

const approvePayment = async (paymentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`Approved payment: ${paymentId}`);
};

const rejectPayment = async (paymentId: string, reason: string, note?: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`Rejected payment: ${paymentId}, reason: ${reason}`, note ? `note: ${note}` : '');
};

const bulkApprovePayments = async (paymentIds: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Bulk approved payments:`, paymentIds);
};

export const usePaymentVerification = () => {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ['payment-stats'],
    queryFn: fetchPaymentStats,
  });

  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  const approveMutation = useMutation({
    mutationFn: approvePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ paymentId, reason, note }: { paymentId: string; reason: string; note?: string }) =>
      rejectPayment(paymentId, reason, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
  });

  const bulkApproveMutation = useMutation({
    mutationFn: bulkApprovePayments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
  });

  return {
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    payments: paymentsQuery.data || [],
    paymentsLoading: paymentsQuery.isLoading,
    approvePayment: approveMutation.mutate,
    rejectPayment: rejectMutation.mutate,
    bulkApprovePayments: bulkApproveMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isBulkApproving: bulkApproveMutation.isPending,
    refetch: () => {
      statsQuery.refetch();
      paymentsQuery.refetch();
    },
  };
};