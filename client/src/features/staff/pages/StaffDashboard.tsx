import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CreditCard,
  FileCheck,
  Search,
  Filter,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { RequestCard } from "@/components/ui/request-card";
import { RequestDetailsDialog } from "../components/RequestDetailsDialog";
import { useStaffDashboard } from "../hooks/useStaffDashboard";

type Request = {
  id: string;
  trackingNumber: string;
  documentType: string;
  residentName: string;
  purpose: string;
  amount: number;
  status: string;
  submittedAt: Date;
  paymentStatus?: "paid" | "unpaid";
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { stats, statsLoading, requests, requestsLoading } =
    useStaffDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch = searchTerm.trim() === "" || 
      (request.residentName?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) ||
      (request.trackingNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) ||
      (request.documentType?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim());

    // Status filter
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatClick = (status: string) => {
    setSelectedStatus(status);
  };

  const handleRequestClick = (id: string) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setDialogOpen(true);
    }
  };

  // Limit displayed requests to 10 on dashboard
  const DISPLAY_LIMIT = 10;
  const displayedRequests = filteredRequests.slice(0, DISPLAY_LIMIT);
  const hasMore = filteredRequests.length > DISPLAY_LIMIT;

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Staff Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage document requests and processing
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats?.totalRequests.count || 0}
          change={stats?.totalRequests.change}
          icon={<FileText className="h-6 w-6" />}
          color="green"
          onClick={() => handleStatClick("all")}
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingReview.count || 0}
          change={stats?.pendingReview.change}
          icon={<Clock className="h-6 w-6" />}
          color="amber"
          onClick={() => handleStatClick("pending")}
        />
        <StatCard
          title="Payment Verification"
          value={stats?.paymentVerification.count || 0}
          change={stats?.paymentVerification.change}
          icon={<CreditCard className="h-6 w-6" />}
          color="emerald"
          onClick={() => handleStatClick("payment_pending")}
        />
        <StatCard
          title="Ready for Generation"
          value={stats?.readyForGeneration.count || 0}
          change={stats?.readyForGeneration.change}
          icon={<FileCheck className="h-6 w-6" />}
          color="teal"
          onClick={() => handleStatClick("ready_for_generation")}
        />
      </div>

      {/* Quick Actions Alert */}
      {(stats?.pendingReview.count || 0) > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Pending Reviews
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {stats?.pendingReview.count} request
                  {stats?.pendingReview.count !== 1 ? "s" : ""} waiting for
                  review
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleStatClick("pending")}
              variant="outline"
              className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50"
            >
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions - Full Width for Better Focus */}
      <Card>
        <CardContent >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
            <span className="text-sm text-muted-foreground">
              {(stats?.paymentVerification.count || 0) + (stats?.readyForGeneration.count || 0)} pending tasks
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {/* Payment Verification Action */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
              onClick={() => navigate("/staff/payment-verification")}
            >
              <div className="rounded-full p-2.5 bg-emerald-100 dark:bg-emerald-950/50">
                <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Payment Verification</div>
                <div className="text-sm text-muted-foreground">
                  {stats?.paymentVerification.count || 0} pending {(stats?.paymentVerification.count || 0) === 1 ? 'payment' : 'payments'}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Document Generation Action */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-300 dark:hover:border-teal-800 transition-all"
              onClick={() => navigate("/staff/document-generation")}
            >
              <div className="rounded-full p-2.5 bg-teal-100 dark:bg-teal-950/50">
                <FileCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Document Generation</div>
                <div className="text-sm text-muted-foreground">
                  {stats?.readyForGeneration.count || 0} ready to generate
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Document Requests
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStatus("all");
              setSearchTerm("");
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="payment_pending">Payment Pending</SelectItem>
              <SelectItem value="payment_verified">Payment Verified</SelectItem>
              <SelectItem value="ready_for_generation">
                Ready for Generation
              </SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request Cards Grid */}
        {requestsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {displayedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onClick={handleRequestClick}
                />
              ))}
            </div>

            {/* View All Requests Button - Navigate to full page */}
            {hasMore && (
              <div className="flex flex-col items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/staff/doc-requests")}
                  className="gap-2"
                >
                  View All Requests ({filteredRequests.length})
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-muted-foreground text-xs">
                  Showing {displayedRequests.length} of{" "}
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? "s" : ""} • View full list
                  for advanced filters
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              No requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your filters or search terms."
                : "No document requests have been submitted yet."}
            </p>
          </div>
        )}
      </div>

      {/* Request Details Dialog */}
      <RequestDetailsDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default StaffDashboard;
