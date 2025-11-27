import api from "@/lib/api";

export interface StatWithChange {
  count: number;
  change: number;
}

export interface StatCount {
  count: number;
}

export interface RevenueStatWithChange {
  amount: number;
  change: number;
}

export interface AverageProcessingTime {
  minutes: number;
  formattedTime: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  staffName: string;
  residentName: string;
  documentType: string;
  trackingNumber: string;
  timestamp: string;
}

export interface PopularDocument {
  documentType: string;
  count: number;
  percentage: number;
}

export interface RequestTrendData {
  month: string;
  count: number;
  monthYear: string;
}

export interface AdminDashboardStats {
  totalResidents: StatWithChange;
  verifiedResidents: StatWithChange;
  pendingVerifications: StatCount;
  activeStaff: StatCount;
  totalDocumentsIssued: StatWithChange;
  totalRequests: StatWithChange;
  pendingRequests: StatCount;
  totalRevenue: RevenueStatWithChange;
  recentActivity: RecentActivity[];
  popularDocuments: PopularDocument[];
  requestTrends: RequestTrendData[];
}

export const adminDashboardService = {
  /**
   * Fetch admin dashboard statistics
   */
  getStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get<AdminDashboardStats>("/dashboard/admin");
    return response.data;
  },
};
