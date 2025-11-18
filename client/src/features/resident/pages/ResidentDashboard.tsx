import { useState } from "react";
import { FileText, Clock, Package, Check } from "lucide-react";
import {
  VerificationReminder,
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentRequests,
  type DashboardStat,
  type RequestData,
} from "../components";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ResidentDashboard = () => {
  const { data: user } = useAuth();
  const [isVerified] = useState(false);
  const [showVerificationReminder] = useState(!isVerified);

  // Mock data for dashboard stats

  // Mock recent requests data
  const recentRequests: RequestData[] = [
    {
      id: "REQ-2024-001",
      type: "Barangay Clearance",
      status: "Ready for Pickup",
      date: "2024-01-15",
      statusColor: "text-green-600 bg-green-50",
    },
    {
      id: "REQ-2024-002",
      type: "Certificate of Residency",
      status: "Action Required",
      date: "2024-01-14",
      statusColor: "text-orange-600 bg-orange-50",
    },
    {
      id: "REQ-2024-003",
      type: "Business Permit",
      status: "Processing",
      date: "2024-01-13",
      statusColor: "text-blue-600 bg-blue-50",
    },
  ];

  // Event handlers
  const handleVerifyClick = () => {
    // TODO: Implement verification logic
    console.log("Verify clicked");
  };

  const handleStatClick = (stat: DashboardStat, index: number) => {
    // TODO: Navigate to specific stat details
    console.log("Stat clicked:", stat.title);
  };

  const handleNewRequest = () => {
    // TODO: Navigate to new request form
    console.log("New request clicked");
  };

  const handleViewAllRequests = () => {
    // TODO: Navigate to all requests page
    console.log("View all requests clicked");
  };

  const handlePickupSchedule = () => {
    // TODO: Navigate to pickup schedule
    console.log("Pickup schedule clicked");
  };

  const handleRequestClick = (request: RequestData) => {
    // TODO: Navigate to request details
    console.log("Request clicked:", request.id);
  };

  // Get the user's first name for the greeting
  const firstName = user?.firstName || user?.email?.split('@')[0] || "Resident";

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Verification Reminder */}
      {showVerificationReminder && (
        <VerificationReminder onVerifyClick={handleVerifyClick} />
      )}

      {/* Welcome Section */}
      <WelcomeSection userName={firstName} />

      {/* Stats Cards */}
      <StatsGrid isVerified={isVerified} onStatClick={handleStatClick} />

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
