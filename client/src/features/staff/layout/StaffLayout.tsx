import BaseDashboardLayout from "@/features/shared/layout/BaseDashboardLayout";
import { StaffSidebar } from "@/components/staff-sidebar";

const StaffLayout = () => {
  return <BaseDashboardLayout sidebar={<StaffSidebar variant="inset" />} />;
};

export default StaffLayout;