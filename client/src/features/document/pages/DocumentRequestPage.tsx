import { columns } from "../components/DocumentRequestDataColumn";
import { Button } from "@/components/ui/button";
import { useFetchDocumentRequests } from "../hooks";
import { DocumentRequestDataTable } from "../components/DocumentRequestDataTable";

const DocumentRequestPage = () => {
  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useFetchDocumentRequests();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Requests
          </h1>
          <p className="text-muted-foreground">
            Review and manage resident document requests
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <span className="text-red-500">
            Error loading document requests. Please try again.
          </span>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DocumentRequestDataTable
          data={requests}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default DocumentRequestPage;
