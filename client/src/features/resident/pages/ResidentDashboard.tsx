import { useMemo, useState } from "react";
import {
  VerificationReminder,
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentRequests,
  AvailableDocumentsInfo,
  OfficeInfoCard,
  HowToVerifyCard,
  type DashboardStat,
  type RequestData,
} from "../components";
import { VerificationDialog } from "../components/VerificationDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useVerificationStatus } from "../hooks/useVerificationStatus";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useFetchDocumentRequests } from "@/features/document/hooks/useFetchDocumentRequests";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentDashboard = () => {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch verification status using cached hook
  const {
    data: verificationData,
    isLoading: isLoadingStatus,
  } = useVerificationStatus();

  const isVerified = verificationData?.isVerified ?? false;
  const verificationStatus = verificationData?.status ?? "Not Submitted";

  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);

  // Refresh verification status after submission
  const handleVerificationSuccess = () => {
    // Invalidate cache to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ["verificationStatus"] });
  };

  // Fetch real document requests for the logged-in resident
  const { data: documentRequests, isLoading: isLoadingRequests } = useFetchDocumentRequests({
    residentId: user?.id,
  });

  // Transform API data to RequestData format and get recent 5 requests
  const recentRequests: RequestData[] = useMemo(() => {
    if (!documentRequests || documentRequests.length === 0) {
      return [];
    }

    // Helper function to get status color and display label
    const getStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "text-yellow-600 bg-yellow-50";
        case "approved":
          return "text-blue-600 bg-blue-50";
        case "payment_pending":
          return "text-orange-600 bg-orange-50";
        case "payment_verified":
          return "text-blue-600 bg-blue-50";
        case "ready_for_generation":
          return "text-green-600 bg-green-50";
        case "completed":
          return "text-emerald-600 bg-emerald-50";
        case "rejected":
          return "text-red-600 bg-red-50";
        default:
          return "text-gray-600 bg-gray-50";
      }
    };

    // Helper function to format status for display
    const formatStatus = (status: string) => {
      switch (status) {
        case "pending":
          return "Pending Review";
        case "approved":
          return "Approved";
        case "payment_pending":
          return "Payment Pending";
        case "payment_verified":
          return "Payment Verified";
        case "ready_for_generation":
          return "Ready for Pickup";
        case "completed":
          return "Completed";
        case "rejected":
          return "Rejected";
        default:
          return status;
      }
    };

    // Sort by date (newest first) and take top 5
    return documentRequests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((req) => ({
        id: req.id,
        type: req.documentType,
        status: formatStatus(req.status),
        date: new Date(req.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        statusColor: getStatusColor(req.status),
      }));
  }, [documentRequests]);

  // Event handlers
  const handleVerifyClick = () => {
    setIsVerificationDialogOpen(true);
  };

  const handleStatClick = (stat: DashboardStat, index: number) => {
    // TODO: Navigate to specific stat details
  };

  const handleNewRequest = () => {
    // TODO: Navigate to new request form
  };

  const handleViewAllRequests = () => {
    // TODO: Navigate to all requests page
  };

  const handlePickupSchedule = () => {
    // TODO: Navigate to pickup schedule
  };

  const handleRequestClick = (request: RequestData) => {
    // TODO: Navigate to request details
  };

  // Get the user's first name for the greeting
  const firstName = user?.firstName || user?.email?.split("@")[0] || "Resident";

  // Show loading state while fetching verification status
  if (isLoadingStatus) {
    return (
      <>
        <VerificationDialog
          open={isVerificationDialogOpen}
          onOpenChange={setIsVerificationDialogOpen}
          onVerificationSuccess={handleVerificationSuccess}
        />

        <div className="space-y-6">
          {/* Loading skeleton for verification banner */}
          <Skeleton className="h-24 w-full rounded-lg" />
          
          {/* Welcome Section */}
          <WelcomeSection userName={firstName} />
          
          {/* Loading skeleton for content */}
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <VerificationDialog
        open={isVerificationDialogOpen}
        onOpenChange={setIsVerificationDialogOpen}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <div className="space-y-6">
        {/* Verification Status Banner */}
        {/* Not Verified - Show Verification Reminder */}
        {!isVerified && verificationStatus === "Not Submitted" && (
          <VerificationReminder onVerifyClick={handleVerifyClick} />
        )}

        {/* Pending Review */}
        {!isVerified && verificationStatus === "Pending" && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-200">
              Verification Under Review
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Your verification documents have been submitted and are
              currently being reviewed by our staff. You will be notified
              once the review is complete. This usually takes 1-3 business
              days.
            </AlertDescription>
          </Alert>
        )}

        {/* Under Review */}
        {!isVerified && verificationStatus === "Under Review" && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-200">
              Verification Under Review
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Your verification is currently being reviewed by our staff. We
              may contact you if additional information is needed. Thank you
              for your patience.
            </AlertDescription>
          </Alert>
        )}

        {/* Approved */}
        {isVerified && verificationStatus === "Approved" && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Verification Approved
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your residency has been verified! You now have full access to
              all barangay services and can submit document requests.
            </AlertDescription>
          </Alert>
        )}

        {/* Rejected */}
        {!isVerified && verificationStatus === "Rejected" && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-800 dark:text-red-200">
              Verification Rejected
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              Your verification request was not approved. Please review your
              documents and submit again. If you have questions, please
              contact the barangay office.
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <WelcomeSection userName={firstName} />

        {/* Conditional Content Based on Verification Status */}
        {isVerified ? (
          <>
            {/* Verified Users: Show Full Dashboard */}
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
              isLoading={isLoadingRequests}
              onRequestClick={handleRequestClick}
            />
          </>
        ) : (
          <>
            {/* Non-Verified Users: Show Information and Guide */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* How to Get Verified */}
              <HowToVerifyCard onStartVerification={handleVerifyClick} />

              {/* Office Information */}
              <OfficeInfoCard />
            </div>

            {/* Available Documents Information */}
            <AvailableDocumentsInfo />
          </>
        )}
      </div>
    </>
  );
};

export default ResidentDashboard;
