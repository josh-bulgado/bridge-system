import { DocumentDataTable } from "../components/DocumentDataTable";
import { columns } from "../components/DocumentDataColumn";
import { Loader2 } from "lucide-react";
import { useFetchDocuments } from "../hooks";

const DocumentManagementPage = () => {
  const { data: documents = [], isLoading, error } = useFetchDocuments();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Management
          </h1>
          <p className="text-muted-foreground">
            Manage barangay documents, pricing, requirements, and availability
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading documents...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center">
          <span className="text-red-500">
            Error loading documents. Please try again.
          </span>
        </div>
      ) : (
        <DocumentDataTable data={documents} columns={columns} />
      )}
    </div>
  );
};

export default DocumentManagementPage;
