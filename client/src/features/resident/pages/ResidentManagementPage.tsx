import { ResidentDataTable } from "../components/ResidentDataTable";
import { columns } from "../components/ResidentDataColumn";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResidents } from "../../staff/hooks";

const ResidentManagementPage = () => {
  const { residents, isLoading, error, refetch } = useResidents();

  return (
    <div className="flex flex-col space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resident Management
          </h1>
          <p className="text-muted-foreground">
            Manage resident verifications, approve or reject validation requests
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading residents...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <span className="text-red-500">
            Error loading residents. Please try again.
          </span>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <ResidentDataTable data={residents || []} columns={columns} />
      )}
    </div>
  );
};

export default ResidentManagementPage;
