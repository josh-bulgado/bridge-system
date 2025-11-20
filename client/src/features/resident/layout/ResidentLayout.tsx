import BaseDashboardLayout from "@/features/shared/layout/BaseDashboardLayout";
import { ResidentSidebar } from "@/features/resident/components/resident-sidebar";

const ResidentLayout = () => {
  return <BaseDashboardLayout sidebar={<ResidentSidebar variant="inset" />} />;
};

export default ResidentLayout;
