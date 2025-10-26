import BaseDashboardLayout from "@/features/shared/layout/BaseDashboardLayout";
import { AdminSidebar } from "@/components/admin-sidebar";

const AdminLayout = () => {
  return <BaseDashboardLayout sidebar={<AdminSidebar variant="inset" />} />;
};

export default AdminLayout;