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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Staff Dashboard
        </h1>
        <p className="text-base text-muted-foreground">
          Manage document requests and processing
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats?.totalRequests.count || 0}
          change={stats?.totalRequests.change}
          icon={<FileText className="h-5 w-5" />}
          color="green"
          onClick={() => handleStatClick("all")}
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingReview.count || 0}
          change={stats?.pendingReview.change}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
          onClick={() => handleStatClick("pending")}
        />
        <StatCard
          title="Payment Verification"
          value={stats?.paymentVerification.count || 0}
          change={stats?.paymentVerification.change}
          icon={<CreditCard className="h-5 w-5" />}
          color="emerald"
          onClick={() => handleStatClick("payment_pending")}
        />
        <StatCard
          title="Ready for Generation"
          value={stats?.readyForGeneration.count || 0}
          change={stats?.readyForGeneration.change}
          icon={<FileCheck className="h-5 w-5" />}
          color="teal"
          onClick={() => handleStatClick("ready_for_generation")}
        />
      </div>

      {/* Quick Actions Alert */}
      {(stats?.pendingReview.count || 0) > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/80 dark:bg-amber-950/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-100 p-2.5 dark:bg-amber-900/50 shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 leading-none">
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
              onClick={() => navigate("/staff/doc-requests")}
              className="bg-amber-600 hover:bg-amber-700 text-white border-0 shrink-0 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions - Full Width for Better Focus */}
      <Card className="border-muted/50">
        <CardContent className="p-6">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {(stats?.paymentVerification.count || 0) + (stats?.readyForGeneration.count || 0)} pending tasks
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Payment Verification Action */}
            <button
              onClick={() => navigate("/staff/payment-verification")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
            >
              <div className="rounded-xl bg-emerald-100 p-3 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-950/50 dark:group-hover:bg-emerald-900/50 shrink-0">
                <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Payment Verification
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  {stats?.paymentVerification.count || 0} pending {(stats?.paymentVerification.count || 0) === 1 ? 'payment' : 'payments'}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>

            {/* Document Generation Action */}
            <button
              onClick={() => navigate("/staff/document-generation")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-teal-800 dark:hover:bg-teal-950/20"
            >
              <div className="rounded-xl bg-teal-100 p-3 transition-colors group-hover:bg-teal-200 dark:bg-teal-950/50 dark:group-hover:bg-teal-900/50 shrink-0">
                <FileCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Document Generation
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  {stats?.readyForGeneration.count || 0} ready to generate
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Document Requests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
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
        <div className="flex flex-col gap-3 sm:flex-row">
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
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
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
              <div className="flex flex-col items-center gap-3 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/staff/doc-requests")}
                  className="gap-2 min-w-[200px]"
                >
                  View All Requests ({filteredRequests.length})
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-muted-foreground text-xs text-center">
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
