import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
// import { regions } from "select-philippines-address";
const AdminDashboard = () => {
  return (
    <>
      <SectionCards />

      <ChartAreaInteractive />
      {/* <DataTable data={data} /> */}
    </>
  );
};

export default AdminDashboard;
