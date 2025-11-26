import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useVerificationStatus } from "../hooks/useVerificationStatus";
import { useFetchMyDocumentRequests } from "../hooks/useFetchMyDocumentRequests";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { VerificationDialog } from "../components/VerificationDialog";
import type { RequestData } from "../components";

// Import new enhanced components
import { DashboardHeader } from "../components/DashboardHeader";
import { VerificationStatusCard } from "../components/VerificationStatusCard";
import { EnhancedStatsGrid } from "../components/EnhancedStatsGrid";
import { VerificationProgressStepper } from "../components/VerificationProgressStepper";
import { DashboardFooter } from "../components/DashboardFooter";
import { OfficeInfoBanner } from "../components/OfficeInfoBanner";
import { EnhancedAvailableDocuments } from "../components/EnhancedAvailableDocuments";
import { EnhancedQuickActions } from "../components/EnhancedQuickActions";
import { EnhancedRecentRequests } from "../components/EnhancedRecentRequests";

const ResidentDashboardRedesigned = () => {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch verification status
  const { data: verificationData, isLoading: isLoadingStatus } =
    useVerificationStatus();

  const isVerified = verificationData?.isVerified ?? false;
  const verificationStatus = verificationData?.status ?? "Not Submitted";
  const rejectionReason = verificationData?.rejectionReason;

  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);

  // Refresh verification status after submission
  const handleVerificationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["verificationStatus"] });
  };

  // Fetch real document requests
  const { data: documentRequests, isLoading: isLoadingRequests } =
    useFetchMyDocumentRequests();

  // Transform API data to RequestData format
  const recentRequests: RequestData[] = useMemo(() => {
    if (!documentRequests || documentRequests.length === 0) {
      return [];
    }

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

    return documentRequests
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
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
        trackingNumber: req.trackingNumber,
      }));
  }, [documentRequests]);

  // Event handlers
  const handleVerifyClick = () => {
    setIsVerificationDialogOpen(true);
  };

  const handleNewRequest = () => {
    navigate("/resident/new-requests");
  };

  const handleViewAllRequests = () => {
    navigate("/resident/requests");
  };

  const handleContactOffice = () => {
    // Scroll to office info or open contact modal
    const officeSection = document.getElementById("office-info");
    if (officeSection) {
      officeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRequestClick = (request: RequestData) => {
    navigate(`/resident/requests/${request.id}`);
  };

  const handleRequestDocument = (documentId: string) => {
    if (isVerified) {
      navigate("/resident/new-requests", {
        state: { preSelectedDocumentId: documentId }
      });
    }
  };

  const handleStatClick = (index: number) => {
    // Navigate to requests with appropriate filter based on stat clicked
    const filters = ["all", "action", "pickup", "completed"];
    navigate("/resident/requests", { state: { filter: filters[index] } });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate("/resident/requests", { state: { searchQuery: query } });
    }
  };

  // Get user's first name
  const firstName = user?.firstName || user?.email?.split("@")[0] || "Resident";

  // Show loading state
  if (isLoadingStatus) {
    return (
      <>
        <VerificationDialog
          open={isVerificationDialogOpen}
          onOpenChange={setIsVerificationDialogOpen}
          onVerificationSuccess={handleVerificationSuccess}
        />

        <div className="space-y-5">
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <Skeleton className="h-48 w-full rounded-lg" />
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
        {/* Dashboard Header with Search */}
        <DashboardHeader 
          userName={firstName} 
          isVerified={isVerified}
          onSearch={handleSearch}
        />

        {/* Verification Status Card - Only show for non-verified users */}
        {!isVerified && (
          <VerificationStatusCard
            status={verificationStatus}
            isVerified={isVerified}
            onStartVerification={handleVerifyClick}
            rejectionReason={rejectionReason}
          />
        )}

        {/* Conditional Layout Based on Verification Status */}
        {isVerified ? (
          <>
            {/* VERIFIED USER DASHBOARD */}
            
            {/* Quick Actions - PRIMARY SECTION */}
            <section>
              <EnhancedQuickActions
                isVerified={isVerified}
                onNewRequest={handleNewRequest}
                onViewRequests={handleViewAllRequests}
                onContactOffice={handleContactOffice}
                onViewPickup={handleViewAllRequests}
              />
            </section>

            {/* Available Documents Section */}
            <section>
              <EnhancedAvailableDocuments
                isVerified={isVerified}
                onRequestDocument={handleRequestDocument}
              />
            </section>

            {/* Recent Requests */}
            <section>
              <EnhancedRecentRequests
                isVerified={isVerified}
                requests={recentRequests}
                isLoading={isLoadingRequests}
                onRequestClick={handleRequestClick}
                onViewAll={handleViewAllRequests}
              />
            </section>

            {/* Office Info */}
            <section>
              <OfficeInfoBanner />
            </section>
          </>
        ) : (
          <>
            {/* NON-VERIFIED USER DASHBOARD */}
            
            {/* Verification Steps */}
            <section>
              <VerificationProgressStepper
                currentStatus={verificationStatus}
                onStartVerification={handleVerifyClick}
              />
            </section>

            {/* Available Documents Preview */}
            <section>
              <EnhancedAvailableDocuments
                isVerified={isVerified}
                onRequestDocument={handleRequestDocument}
              />
            </section>

            {/* Office Info */}
            <section>
              <OfficeInfoBanner />
            </section>

            {/* Helpful Information Cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20 p-5 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-2">Fast Processing</h3>
                <p className="text-xs text-muted-foreground">
                  Most documents ready in 1-3 business days
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20 p-5 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-2">Secure Process</h3>
                <p className="text-xs text-muted-foreground">
                  Your documents are handled with strict confidentiality
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20 p-5 text-center sm:col-span-2 lg:col-span-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-2">24/7 Support</h3>
                <p className="text-xs text-muted-foreground">
                  Get help anytime through our support channels
                </p>
              </div>
            </section>
          </>
        )}

        {/* Footer with Contact Office and Help Center */}
        <DashboardFooter onContactOffice={handleContactOffice} />
      </div>
    </>
  );
};

export default ResidentDashboardRedesigned;
