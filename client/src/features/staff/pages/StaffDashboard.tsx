import { useState } from "react";
import {
  FileText,
  Clock,
  CreditCard,
  Download,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityActionCard } from "../components";
import { StatCard } from "@/components/ui/stat-card";
import { RequestCard } from "@/components/ui/request-card";
import { useStaffDashboard } from "../hooks/useStaffDashboard";
import type { Request } from "../types";

const StaffDashboard = () => {
  const { stats, statsLoading, requests, requestsLoading, refetch } = useStaffDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter requests based on search and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDocumentType = 
      selectedDocumentType === "all" || request.documentType === selectedDocumentType;
    
    const matchesStatus = 
      selectedStatus === "all" || request.status === selectedStatus;

    return matchesSearch && matchesDocumentType && matchesStatus;
  });

  const handleStatClick = (filterType: string) => {
    switch (filterType) {
      case 'pending':
        setSelectedStatus('pending');
        break;
      case 'payment':
        setSelectedStatus('payment_pending');
        break;
      case 'generation':
        setSelectedStatus('ready_for_generation');
        break;
      default:
        setSelectedStatus('all');
    }
  };

  const handlePriorityAction = (actionType: 'payment' | 'generation') => {
    if (actionType === 'payment') {
      // Navigate to payment verification page
      window.location.href = '/staff/payment-verification';
    } else {
      setSelectedStatus('ready_for_generation');
    }
  };

  const handleRequestAction = (request: Request, action: 'view' | 'approve' | 'reject') => {
    console.log(`${action} request:`, request.id);
    // TODO: Implement actual request actions
    if (action === 'approve' || action === 'reject') {
      // Refetch data after action
      setTimeout(() => refetch(), 500);
    }
  };

  const paymentPendingCount = requests.filter(r => r.status === 'payment_pending').length;
  const readyForGenerationCount = requests.filter(r => r.status === 'ready_for_generation').length;

  return (
    <div className="space-y-8 px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600">Manage document requests and processing</p>
      </div>

      {/* Statistics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : stats ? (
          <>
            <StatCard
              title="Total Requests"
              value={stats.totalRequests.count}
              change={stats.totalRequests.change}
              color="green"
              icon={<FileText className="h-8 w-8" />}
              onClick={() => handleStatClick('all')}
            />
            <StatCard
              title="Pending Review"
              value={stats.pendingReview.count}
              change={stats.pendingReview.change}
              color="amber"
              icon={<Clock className="h-8 w-8" />}
              onClick={() => handleStatClick('pending')}
            />
            <StatCard
              title="Payment Verification"
              value={stats.paymentVerification.count}
              change={stats.paymentVerification.change}
              color="emerald"
              icon={<CreditCard className="h-8 w-8" />}
              onClick={() => handleStatClick('payment')}
            />
            <StatCard
              title="Ready for Generation"
              value={stats.readyForGeneration.count}
              change={stats.readyForGeneration.change}
              color="teal"
              icon={<Download className="h-8 w-8" />}
              onClick={() => handleStatClick('generation')}
            />
          </>
        ) : null}
      </div>

      {/* Priority Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <PriorityActionCard
          title="Payment Verification"
          count={paymentPendingCount}
          theme="emerald"
          icon={CreditCard}
          buttonText="Review Now"
          onClick={() => handlePriorityAction('payment')}
        />
        <PriorityActionCard
          title="Document Generation"
          count={readyForGenerationCount}
          theme="teal"
          icon={Download}
          buttonText="Generate Now"
          onClick={() => handlePriorityAction('generation')}
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Header and Filters */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Document Requests Overview
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                  <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
                  <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="payment_pending">Payment Pending</SelectItem>
                  <SelectItem value="ready_for_generation">Ready for Generation</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {requestsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewDetails={(id) => handleRequestAction(request, 'view')}
                onApprove={(id) => handleRequestAction(request, 'approve')}
                onReject={(id) => handleRequestAction(request, 'reject')}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDocumentType !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'No document requests have been submitted yet.'}
              </p>
              {(searchTerm || selectedDocumentType !== 'all' || selectedStatus !== 'all') && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDocumentType('all');
                    setSelectedStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { StaffDashboard as default };