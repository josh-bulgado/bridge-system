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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-base text-muted-foreground">
          System overview and management
        </p>
      </div>

      {/* Statistics Grid - 4 columns on large screens, responsive on smaller */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl" />
            ))}
          </>
        ) : stats ? (
          <>
            <AdminStatCard
              title="Total Residents"
              value={stats.totalResidents.count}
              change={stats.totalResidents.change}
              icon={<Users className="h-5 w-5" />}
              color="emerald"
            />
            <AdminStatCard
              title="Verified Residents"
              value={stats.verifiedResidents.count}
              change={stats.verifiedResidents.change}
              icon={<UserCheck className="h-5 w-5" />}
              color="green"
            />
            <AdminStatCard
              title="Pending Verifications"
              value={stats.pendingVerifications.count}
              icon={<Clock className="h-5 w-5" />}
              color="amber"
              onClick={() => navigate("/admin/residents")}
            />
            <AdminStatCard
              title="Active Staff"
              value={stats.activeStaff.count}
              icon={<UserCog className="h-5 w-5" />}
              color="teal"
              onClick={() => navigate("/admin/staff")}
            />
            <AdminStatCard
              title="Documents Issued"
              value={stats.totalDocumentsIssued.count}
              change={stats.totalDocumentsIssued.change}
              icon={<FileText className="h-5 w-5" />}
              color="cyan"
            />
            <AdminStatCard
              title="Total Requests"
              value={stats.totalRequests.count}
              change={stats.totalRequests.change}
              icon={<ClipboardList className="h-5 w-5" />}
              color="lime"
            />
            <AdminStatCard
              title="Revenue (Monthly)"
              value={`₱${stats.totalRevenue.amount.toLocaleString()}`}
              change={stats.totalRevenue.change}
              icon={<PhilippinePeso className="h-5 w-5" />}
              color="green"
            />
          </>
        ) : null}
      </div>

      {/* Quick Actions Alert - Pending Verifications */}
      {stats && stats.pendingVerifications.count > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/80 dark:bg-amber-950/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-100 p-2.5 dark:bg-amber-900/50 shrink-0">
                <Clock className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 leading-none">
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
              className="bg-amber-600 hover:bg-amber-700 text-white border-0 shrink-0 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Admin Quick Actions */}
      <Card className="border-muted/50">
        <CardContent className="p-6">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Administrative functions
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Manage Residents */}
            <button
              onClick={() => navigate("/admin/resident-management")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
            >
              <div className="rounded-xl bg-emerald-100 p-3 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-950/50 dark:group-hover:bg-emerald-900/50 shrink-0">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Manage Residents
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  {stats?.pendingVerifications.count || 0} pending
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>

            {/* Manage Staff */}
            <button
              onClick={() => navigate("/admin/staff-management")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-teal-800 dark:hover:bg-teal-950/20"
            >
              <div className="rounded-xl bg-teal-100 p-3 transition-colors group-hover:bg-teal-200 dark:bg-teal-950/50 dark:group-hover:bg-teal-900/50 shrink-0">
                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Manage Staff
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  {stats?.activeStaff.count || 0} active
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>

            {/* Document Management */}
            <button
              onClick={() => navigate("/admin/documents")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20"
            >
              <div className="rounded-xl bg-cyan-100 p-3 transition-colors group-hover:bg-cyan-200 dark:bg-cyan-950/50 dark:group-hover:bg-cyan-900/50 shrink-0">
                <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Documents
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  {stats?.totalDocumentsIssued.count || 0} issued
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>

            {/* Barangay Settings */}
            <button
              onClick={() => navigate("/admin/barangay-config")}
              className="group relative flex items-start gap-4 rounded-xl border border-muted/50 bg-card p-5 text-left transition-all hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm active:scale-[0.98] dark:hover:border-green-800 dark:hover:bg-green-950/20"
            >
              <div className="rounded-xl bg-green-100 p-3 transition-colors group-hover:bg-green-200 dark:bg-green-950/50 dark:group-hover:bg-green-900/50 shrink-0">
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1.5 leading-tight">
                  Settings
                </div>
                <div className="text-sm text-muted-foreground leading-tight">
                  Barangay config
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 absolute top-5 right-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Request Trends Chart - Takes 3 columns */}
        <div className="lg:col-span-3">
          <RequestTrendsChart
            trends={stats?.requestTrends || []}
            isLoading={isLoading}
          />
        </div>

        {/* Popular Documents - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PopularDocumentsChart
            documents={stats?.popularDocuments || []}
            isLoading={isLoading}
          />
        </div>
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
