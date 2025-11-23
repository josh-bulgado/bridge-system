import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { PaymentCard } from "../components/PaymentCard";
import { ReceiptPreviewModal } from "../components/ReceiptPreviewModal";
import { RejectionModal } from "../components/RejectionModal";
import { usePaymentVerification } from "../hooks/usePaymentVerification";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  CreditCard,
  Check,
  FileText,
} from "lucide-react";
import type { PaymentRecord } from "../types/payment";

const PaymentVerification = () => {
  const navigate = useNavigate();
  const {
    stats,
    statsLoading,
    payments,
    paymentsLoading,
    approvePayment,
    rejectPayment,
    bulkApprovePayments,
    isRejecting,
    isBulkApproving,
  } = usePaymentVerification();

  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(
    new Set(),
  );
  const [previewPayment, setPreviewPayment] = useState<PaymentRecord | null>(
    null,
  );
  const [rejectPaymentState, setRejectPaymentState] =
    useState<PaymentRecord | null>(null);

  // Filter payments based on active tab
  const filteredPayments = useMemo(() => {
    if (!payments) return [];

    switch (activeTab) {
      case "pending":
        return payments.filter((p) => p.status === "pending_verification");
      case "verified":
        return payments.filter((p) => p.status === "verified");
      case "all":
        return payments;
      default:
        return payments;
    }
  }, [payments, activeTab]);

  // Get counts for tabs
  const tabCounts = useMemo(() => {
    if (!payments) return { pending: 0, verified: 0, all: 0 };

    return {
      pending: payments.filter((p) => p.status === "pending_verification")
        .length,
      verified: payments.filter((p) => p.status === "verified").length,
      all: payments.length,
    };
  }, [payments]);

  const handleApprove = (paymentId: string) => {
    approvePayment(paymentId);
  };

  const handleReject = (paymentId: string) => {
    const payment = payments?.find((p) => p.id === paymentId);
    if (payment) {
      setRejectPaymentState(payment);
    }
  };

  const handleRejectConfirm = (
    paymentId: string,
    reason: string,
    note?: string,
  ) => {
    rejectPayment({ paymentId, reason, note });
    setRejectPaymentState(null);
  };

  const handleViewReceipt = (payment: PaymentRecord) => {
    setPreviewPayment(payment);
  };

  const handleSelectPayment = (paymentId: string, selected: boolean) => {
    const newSelected = new Set(selectedPayments);
    if (selected) {
      newSelected.add(paymentId);
    } else {
      newSelected.delete(paymentId);
    }
    setSelectedPayments(newSelected);
  };

  const handleSelectAll = () => {
    const pendingPayments = filteredPayments.filter(
      (p) => p.status === "pending_verification",
    );
    if (selectedPayments.size === pendingPayments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(pendingPayments.map((p) => p.id)));
    }
  };

  const handleBulkApprove = () => {
    if (selectedPayments.size > 0) {
      bulkApprovePayments(Array.from(selectedPayments));
      setSelectedPayments(new Set());
    }
  };

  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending_verification",
  );
  const canBulkApprove = selectedPayments.size > 0 && activeTab === "pending";

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/staff")}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Verification Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Review GCash receipts and verify payments
          </p>
        </div>

        {canBulkApprove && (
          <Button
            onClick={handleBulkApprove}
            disabled={isBulkApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            {isBulkApproving
              ? `Approving ${selectedPayments.size}...`
              : `Approve Selected (${selectedPayments.size})`}
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : stats ? (
          <>
            <StatCard
              title="Pending Verification"
              value={stats.pendingVerification}
              change={-5.2}
              color="orange"
              icon={<Clock className="h-8 w-8" />}
              onClick={() => setActiveTab("pending")}
            />
            <StatCard
              title="Verified Today"
              value={stats.verifiedToday}
              change={12.5}
              color="green"
              icon={<CheckCircle className="h-8 w-8" />}
              onClick={() => setActiveTab("verified")}
            />
            <StatCard
              title="Total Amount"
              value={stats.totalAmount}
              change={8.7}
              color="blue"
              icon={<CreditCard className="h-8 w-8" />}
            />
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Pending Verification
              {tabCounts.pending > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full bg-orange-500 p-0 text-xs">
                  {tabCounts.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified" className="relative">
              Verified
              {tabCounts.verified > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {tabCounts.verified}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Payments</TabsTrigger>
          </TabsList>

          {/* Bulk Selection Controls */}
          {activeTab === "pending" && pendingPayments.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={
                    selectedPayments.size === pendingPayments.length &&
                    pendingPayments.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Select All ({pendingPayments.length})
              </label>
              {selectedPayments.size > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedPayments.size} selected
                </span>
              )}
            </div>
          )}
        </div>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {paymentsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          ) : filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewReceipt={handleViewReceipt}
                isSelected={selectedPayments.has(payment.id)}
                onSelect={handleSelectPayment}
                showSelection={true}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No pending payments
              </h3>
              <p className="text-gray-600">
                All payments have been processed. Great job!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-6 space-y-4">
          {paymentsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          ) : filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewReceipt={handleViewReceipt}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No verified payments
              </h3>
              <p className="text-gray-600">
                Verified payments will appear here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {paymentsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          ) : filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewReceipt={handleViewReceipt}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No payments found
              </h3>
              <p className="text-gray-600">Payment records will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ReceiptPreviewModal
        payment={previewPayment}
        isOpen={!!previewPayment}
        onClose={() => setPreviewPayment(null)}
      />

      <RejectionModal
        payment={rejectPaymentState}
        isOpen={!!rejectPaymentState}
        onClose={() => setRejectPaymentState(null)}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />
    </div>
  );
};

export default PaymentVerification;
