import { useAdminDashboard } from "../hooks/useAdminDashboard";
import {
  AdminStatCard,
  RecentActivityFeed,
  PopularDocumentsChart,
  RequestTrendsChart,
} from "../components";
import {
  Users,
  UserCheck,
  UserCog,
  FileText,
  ClipboardList,
  Clock,
  PhilippinePeso,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminDashboard();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System overview and management
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          System overview and management
        </p>
      </div>

      {/* Primary Statistics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : stats ? (
          <>
            <AdminStatCard
              title="Total Residents"
              value={stats.totalResidents.count}
              change={stats.totalResidents.change}
              icon={<Users className="h-6 w-6" />}
              color="emerald"
            />
            <AdminStatCard
              title="Verified Residents"
              value={stats.verifiedResidents.count}
              change={stats.verifiedResidents.change}
              icon={<UserCheck className="h-6 w-6" />}
              color="green"
            />
            <AdminStatCard
              title="Pending Verifications"
              value={stats.pendingVerifications.count}
              icon={<Clock className="h-6 w-6" />}
              color="amber"
              onClick={() => navigate("/admin/residents")}
            />
            <AdminStatCard
              title="Active Staff"
              value={stats.activeStaff.count}
              icon={<UserCog className="h-6 w-6" />}
              color="teal"
              onClick={() => navigate("/admin/staff")}
            />
          </>
        ) : null}
      </div>

      {/* Secondary Statistics Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : stats ? (
          <>
            <AdminStatCard
              title="Documents Issued"
              value={stats.totalDocumentsIssued.count}
              change={stats.totalDocumentsIssued.change}
              icon={<FileText className="h-6 w-6" />}
              color="cyan"
            />
            <AdminStatCard
              title="Total Requests"
              value={stats.totalRequests.count}
              change={stats.totalRequests.change}
              icon={<ClipboardList className="h-6 w-6" />}
              color="lime"
            />
            <AdminStatCard
              title="Revenue (Monthly)"
              value={`₱${stats.totalRevenue.amount.toLocaleString()}`}
              change={stats.totalRevenue.change}
              icon={<PhilippinePeso size={24} />}
              color="green"
            />
          </>
        ) : null}
      </div>

      {/* Quick Actions */}
      {stats && stats.pendingVerifications.count > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Pending Verifications
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {stats.pendingVerifications.count} resident
                {stats.pendingVerifications.count !== 1 ? "s" : ""} waiting for
                verification
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/residents")}
              variant="outline"
              className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50"
            >
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Charts and Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Trends Chart */}
        <RequestTrendsChart
          trends={stats?.requestTrends || []}
          isLoading={isLoading}
        />

        {/* Popular Documents */}
        <PopularDocumentsChart
          documents={stats?.popularDocuments || []}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Activity Feed */}
      <RecentActivityFeed
        activities={stats?.recentActivity || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboard;
