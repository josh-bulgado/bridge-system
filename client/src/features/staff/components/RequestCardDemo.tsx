import React from "react";
import { RequestCard } from "@/components/ui/request-card";

export const RequestCardDemo: React.FC = () => {
  const handleViewDetails = (id: string) => {
    console.log(`View details for request: ${id}`);
  };

  const handleApprove = (id: string) => {
    console.log(`Approve request: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Reject request: ${id}`);
  };

  const sampleRequests = [
    {
      id: "1",
      trackingNumber: "REQ-2024-001",
      documentType: "Barangay Clearance",
      residentName: "Juan dela Cruz",
      purpose: "Employment requirements for new job application",
      amount: 50,
      status: "pending" as const,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      trackingNumber: "REQ-2024-002",
      documentType: "Certificate of Residency",
      residentName: "Maria Santos",
      purpose: "School enrollment for elementary education",
      amount: 30,
      status: "payment_pending" as const,
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      paymentStatus: "paid" as const,
    },
    {
      id: "3",
      trackingNumber: "REQ-2024-003",
      documentType: "Certificate of Indigency",
      residentName: "Pedro Garcia",
      purpose: "Medical assistance and hospital bill reduction",
      amount: 20,
      status: "ready_for_generation" as const,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      paymentStatus: "paid" as const,
    },
    {
      id: "4",
      trackingNumber: "REQ-2024-004",
      documentType: "Barangay Clearance",
      residentName: "Ana Rodriguez",
      purpose: "Business permit application for small retail store",
      amount: 50,
      status: "approved" as const,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: "5",
      trackingNumber: "REQ-2024-005",
      documentType: "Certificate of Residency",
      residentName: "Carlos Mendoza",
      purpose: "Bank account opening requirements",
      amount: 30,
      status: "pending" as const,
      submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: "6",
      trackingNumber: "REQ-2024-006",
      documentType: "Business Permit",
      residentName: "Lisa Chen",
      purpose: "Food cart business permit renewal",
      amount: 100,
      status: "payment_pending" as const,
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      paymentStatus: "unpaid" as const,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">RequestCard Component Examples</h2>
        <p className="text-gray-600">Interactive document request cards with different statuses and features</p>
      </div>
      
      {/* All Status Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Status Examples</h3>
        <div className="space-y-4">
          {sampleRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>

      {/* Read-only Example */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Read-only Example (No Actions)</h3>
        <RequestCard
          request={sampleRequests[2]}
          onViewDetails={handleViewDetails}
          // No onApprove/onReject = no action buttons
        />
      </div>

      {/* Custom Styling Example */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Styling Example</h3>
        <RequestCard
          request={sampleRequests[0]}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
          className="border-2 border-blue-200 bg-blue-50/30"
        />
      </div>

      {/* Usage Examples */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700">Basic Usage:</h4>
            <pre className="bg-white p-3 rounded border mt-2 overflow-x-auto">
{`<RequestCard
  request={requestData}
  onViewDetails={(id) => navigate(\`/requests/\${id}\`)}
  onApprove={(id) => approveRequest(id)}
  onReject={(id) => rejectRequest(id)}
/>`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Read-only (no actions):</h4>
            <pre className="bg-white p-3 rounded border mt-2 overflow-x-auto">
{`<RequestCard
  request={requestData}
  onViewDetails={(id) => navigate(\`/requests/\${id}\`)}
  // No onApprove/onReject props
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};