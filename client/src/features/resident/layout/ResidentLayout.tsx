import BaseDashboardLayout from "@/features/shared/layout/BaseDashboardLayout";
import { ResidentSidebar } from "@/components/resident-sidebar";

const ResidentLayout = () => {
  return <BaseDashboardLayout sidebar={<ResidentSidebar variant="inset" />} />;
};

export default ResidentLayout;