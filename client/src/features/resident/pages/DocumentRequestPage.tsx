import { DocumentRequestDataTable } from "../components/DocumentRequestDataTable";
import { columns } from "../components/DocumentRequestColumn";
import { useFetchMyDocumentRequests } from "../hooks";

const DocumentRequestPage = () => {
  const { data: requests = [], isLoading, error } = useFetchMyDocumentRequests();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Document Requests
          </h1>
          <p className="text-muted-foreground">
            View and track your document requests
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {error ? (
        <div className="flex items-center justify-center">
          <span className="text-red-500">
            Error loading requests. Please try again.
          </span>
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
