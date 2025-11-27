import api from "@/lib/api";

export interface StatWithChange {
  count: number;
  change: number;
}

export interface StatCount {
  count: number;
}

export interface AverageProcessingTime {
  minutes: number;
  formattedTime: string;
}

export interface StaffDashboardStats {
  totalRequests: StatWithChange;
  pendingReview: StatWithChange;
  paymentVerification: StatWithChange;
  readyForGeneration: StatWithChange;
  myProcessedToday: StatCount;
  completedToday: StatCount;
  avgProcessingTime: AverageProcessingTime;
}

export const staffDashboardService = {
  /**
   * Fetch staff dashboard statistics
   */
  getStats: async (): Promise<StaffDashboardStats> => {
    const response = await api.get<StaffDashboardStats>("/dashboard/staff");
    return response.data;
  },
};
