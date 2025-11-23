import { columns } from "../components/DocumentRequestDataColumn";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { DocumentRequest } from "../types/documentRequest";
import { DocumentRequestDataTable } from "../components/DocumentRequestDataTable";

// TODO: Replace with actual hook when backend is ready
const useFetchDocumentRequests = () => {
  // Mock data for UI development
  const mockData: DocumentRequest[] = [
    {
      id: "1",
      trackingNumber: "BR-2024-001",
      documentType: "Barangay Clearance",
      residentName: "Juan Dela Cruz",
      residentEmail: "juan@example.com",
      purpose: "Employment requirement",
      amount: 50,
      status: "pending",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      trackingNumber: "BR-2024-002",
      documentType: "Certificate of Residency",
      residentName: "Maria Santos",
      residentEmail: "maria@example.com",
      purpose: "Business permit application",
      amount: 75,
      status: "approved",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      trackingNumber: "BR-2024-003",
      documentType: "Certificate of Indigency",
      residentName: "Pedro Reyes",
      residentEmail: "pedro@example.com",
      purpose: "Medical assistance",
      amount: 30,
      status: "payment_pending",
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "4",
      trackingNumber: "BR-2024-004",
      documentType: "Barangay Clearance",
      residentName: "Ana Lopez",
      residentEmail: "ana@example.com",
      purpose: "Police clearance requirement",
      amount: 50,
      status: "ready_for_generation",
      submittedAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "5",
      trackingNumber: "BR-2024-005",
      documentType: "Certificate of Residency",
      residentName: "Jose Garcia",
      residentEmail: "jose@example.com",
      purpose: "School enrollment",
      amount: 75,
      status: "completed",
      submittedAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => console.log("Refetching..."),
  };
};

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
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading document requests...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <span className="text-red-500">
            Error loading document requests. Please try again.
          </span>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DocumentRequestDataTable data={requests} columns={columns} />
      )}
    </div>
  );
};

export default DocumentRequestPage;
