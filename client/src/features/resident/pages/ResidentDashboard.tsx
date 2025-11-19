import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, Package, Check } from "lucide-react";
import {
  VerificationReminder,
  WelcomeSection,
  QuickActions,
  RecentRequests,
  type DashboardStat,
  type RequestData,
} from "../components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDocumentRequests } from "../hooks/useDocumentRequests";
import { StatCard } from "../components/StatCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { requests, statistics, isLoading, isLoadingStats } = useDocumentRequests();
  const [isVerified] = useState(true);
  const [showVerificationReminder] = useState(!isVerified);

  // Convert API requests to RequestData format for recent requests
  const recentRequests: RequestData[] = useMemo(() => {
    if (!requests) return [];
    
    const getStatusColor = (status: string) => {
      const colors: { [key: string]: string } = {
        Pending: "text-yellow-600 bg-yellow-50",
        Processing: "text-blue-600 bg-blue-50",
        "Action Required": "text-orange-600 bg-orange-50",
        "Ready for Pickup": "text-green-600 bg-green-50",
        Completed: "text-emerald-600 bg-emerald-50",
        Rejected: "text-red-600 bg-red-50",
      };
      return colors[status] || "text-gray-600 bg-gray-50";
    };

    return requests.slice(0, 5).map((request) => ({
      id: request.requestNumber,
      type: request.documentType,
      status: request.status,
      date: format(new Date(request.createdAt), "yyyy-MM-dd"),
      statusColor: getStatusColor(request.status),
    }));
  }, [requests]);

  // Create dashboard stats from statistics
  const dashboardStats: DashboardStat[] = useMemo(() => {
    if (!statistics) {
      return [
        {
          title: "Total Requests",
          count: 0,
          description: "All submitted requests",
          icon: FileText,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
        },
        {
          title: "Action Required",
          count: 0,
          description: "Requests needing your action",
          icon: Clock,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/30",
        },
        {
          title: "Ready for Pickup",
          count: 0,
          description: "Documents ready to collect",
          icon: Package,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/30",
        },
        {
          title: "Completed",
          count: 0,
          description: "Successfully processed",
          icon: Check,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
        },
      ];
    }

    return [
      {
        title: "Total Requests",
        count: statistics.totalRequests,
        description: "All submitted requests",
        icon: FileText,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/30",
      },
      {
        title: "Action Required",
        count: statistics.actionRequiredRequests,
        description: "Requests needing your action",
        icon: Clock,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-900/30",
      },
      {
        title: "Ready for Pickup",
        count: statistics.readyForPickupRequests,
        description: "Documents ready to collect",
        icon: Package,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/30",
      },
      {
        title: "Completed",
        count: statistics.completedRequests,
        description: "Successfully processed",
        icon: Check,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      },
    ];
  }, [statistics]);

  // Event handlers
  const handleVerifyClick = () => {
    navigate("/resident/verification");
  };

  const handleStatClick = (stat: DashboardStat, index: number) => {
    navigate("/resident/requests");
  };

  const handleNewRequest = () => {
    navigate("/resident/new-request");
  };

  const handleViewAllRequests = () => {
    navigate("/resident/requests");
  };

  const handlePickupSchedule = () => {
    navigate("/resident/requests");
  };

  const handleRequestClick = (request: RequestData) => {
    // Find the actual request by request number
    const actualRequest = requests?.find(r => r.requestNumber === request.id);
    if (actualRequest) {
      navigate(`/resident/requests/${actualRequest.id}`);
    }
  };

  // Get the user's first name for the greeting
  const firstName = user?.user?.firstName || user?.firstName || user?.user?.email?.split('@')[0] || "Resident";

  if (isLoading || isLoadingStats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Verification Reminder */}
      {showVerificationReminder && (
        <VerificationReminder onVerifyClick={handleVerifyClick} />
      )}

      {/* Welcome Section */}
      <WelcomeSection userName={firstName} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            isLocked={!isVerified}
            onClick={() => handleStatClick(stat, index)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions
        isVerified={isVerified}
        onNewRequest={handleNewRequest}
        onViewAllRequests={handleViewAllRequests}
        onPickupSchedule={handlePickupSchedule}
      />

      {/* Recent Requests */}
      <RecentRequests
        isVerified={isVerified}
        requests={recentRequests}
        onRequestClick={handleRequestClick}
      />
    </div>
  );
};

export default ResidentDashboard;
