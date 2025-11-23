import { StaffDataTable } from "../components/StaffDataTable";
import { columns } from "../components/StaffDataColumn";
import { Loader2 } from "lucide-react";
import { useFetchStaff } from "../hooks";

const StaffManagementPage = () => {
  const { data: staff = [], isLoading, error } = useFetchStaff();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage barangay staff accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading staff...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center">
          <span className="text-red-500">
            Error loading staff. Please try again.
          </span>
        </div>
      ) : (
        <StaffDataTable data={staff} columns={columns} />
      )}
    </div>
  );
};

export default StaffManagementPage;
