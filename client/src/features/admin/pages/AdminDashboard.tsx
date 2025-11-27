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
  Settings,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

      {/* Quick Actions Alert - Pending Verifications */}
      {stats && stats.pendingVerifications.count > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
            </div>
            <Button
              onClick={() => navigate("/admin/resident-management?status=Pending")}
              variant="outline"
              className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50"
            >
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Admin Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
            <span className="text-sm text-muted-foreground">
              Administrative functions
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Manage Residents */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
              onClick={() => navigate("/admin/resident-management")}
            >
              <div className="rounded-full p-2.5 bg-emerald-100 dark:bg-emerald-950/50">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Manage Residents</div>
                <div className="text-sm text-muted-foreground">
                  {stats?.pendingVerifications.count || 0} pending
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Manage Staff */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-300 dark:hover:border-teal-800 transition-all"
              onClick={() => navigate("/admin/staff-management")}
            >
              <div className="rounded-full p-2.5 bg-teal-100 dark:bg-teal-950/50">
                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Manage Staff</div>
                <div className="text-sm text-muted-foreground">
                  {stats?.activeStaff.count || 0} active
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Document Management */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 hover:border-cyan-300 dark:hover:border-cyan-800 transition-all"
              onClick={() => navigate("/admin/documents")}
            >
              <div className="rounded-full p-2.5 bg-cyan-100 dark:bg-cyan-950/50">
                <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Documents</div>
                <div className="text-sm text-muted-foreground">
                  {stats?.totalDocumentsIssued.count || 0} issued
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Barangay Settings */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-5 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-800 transition-all"
              onClick={() => navigate("/admin/barangay-config")}
            >
              <div className="rounded-full p-2.5 bg-green-100 dark:bg-green-950/50">
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Settings</div>
                <div className="text-sm text-muted-foreground">
                  Barangay config
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
