import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DocumentRequestDataTable } from "../components/DocumentRequestDataTable";
import { columns } from "../components/DocumentRequestColumn";
import { useFetchMyDocumentRequests } from "../hooks";

const DocumentRequestPage = () => {
  const location = useLocation();
  const { data: requests = [], isLoading, error } = useFetchMyDocumentRequests();
  const [filteredRequests, setFilteredRequests] = useState(requests);

  // Handle filter and search from dashboard navigation
  useEffect(() => {
    if (!requests || requests.length === 0) {
      setFilteredRequests([]);
      return;
    }

    let filtered = [...requests];

    // Apply filter from state
    const state = location.state as { filter?: string; searchQuery?: string } | null;
    
    if (state?.filter) {
      switch (state.filter) {
        case "action":
          // Payment pending or needs attention
          filtered = filtered.filter(
            (req) => req.status === "payment_pending" || req.status === "rejected"
          );
          break;
        case "pickup":
          // Ready for pickup
          filtered = filtered.filter((req) => req.status === "ready_for_generation");
          break;
        case "completed":
          // Completed requests
          filtered = filtered.filter((req) => req.status === "completed");
          break;
        case "all":
        default:
          // Show all
          break;
      }
    }

    // Apply search query from state
    if (state?.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.documentType.toLowerCase().includes(query) ||
          req.status.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, location.state]);

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
          data={filteredRequests}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default DocumentRequestPage;
