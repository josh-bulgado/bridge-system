import React, { useState } from "react";
import { RequestCard } from "@/components/ui/request-card";
import { RequestCardCompact } from "@/components/ui/request-card-compact";
import { RequestCardList } from "@/components/ui/request-card-list";
import { RequestCardContainer } from "@/components/ui/request-card-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RequestCardVariantsDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'individual' | 'container'>('individual');

  const handleViewDetails = (id: string) => {
    console.log(`View details for request: ${id}`);
  };

  const handleApprove = (id: string) => {
    console.log(`Approve request: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Reject request: ${id}`);
  };

  const handleBulkAction = (action: 'approve' | 'reject', ids: string[]) => {
    console.log(`${action} requests:`, ids);
  };

  const handleFiltersChange = (filters: any, filteredCount: number) => {
    console.log('Filters changed:', filters, 'Filtered count:', filteredCount);
  };

  const sampleRequest = {
    id: "1",
    trackingNumber: "REQ-2024-001",
    documentType: "Barangay Clearance",
    residentName: "Juan dela Cruz",
    purpose: "Employment requirements for new job application",
    amount: 50,
    status: "pending" as const,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    paymentStatus: "paid" as const,
  };

  const sampleRequests = [
    sampleRequest,
    {
      id: "2",
      trackingNumber: "REQ-2024-002",
      documentType: "Certificate of Residency",
      residentName: "Maria Santos",
      purpose: "School enrollment",
      amount: 30,
      status: "payment_pending" as const,
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      trackingNumber: "REQ-2024-003",
      documentType: "Certificate of Indigency",
      residentName: "Pedro Garcia",
      purpose: "Medical assistance",
      amount: 20,
      status: "ready_for_generation" as const,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      paymentStatus: "paid" as const,
    },
    {
      id: "4",
      trackingNumber: "REQ-2024-004",
      documentType: "Barangay Clearance",
      residentName: "Ana Rodriguez",
      purpose: "Business permit application",
      amount: 50,
      status: "approved" as const,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      trackingNumber: "REQ-2024-005",
      documentType: "Certificate of Residency",
      residentName: "Carlos Mendoza",
      purpose: "Bank account opening",
      amount: 30,
      status: "pending" as const,
      submittedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">RequestCard Variants Demo</h2>
        <p className="text-gray-600">Three specialized view variants for different use cases</p>
      </div>

      {/* Demo Toggle */}
      <div className="flex gap-2">
        <Button
          variant={selectedDemo === 'individual' ? 'default' : 'outline'}
          onClick={() => setSelectedDemo('individual')}
        >
          Individual Variants
        </Button>
        <Button
          variant={selectedDemo === 'container' ? 'default' : 'outline'}
          onClick={() => setSelectedDemo('container')}
        >
          Container Component
        </Button>
      </div>

      {selectedDemo === 'individual' ? (
        <>
          {/* Standard Card View */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              1. Standard Card View (Default)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Full-featured card with detailed information, ideal for detailed review workflows.
            </p>
            <RequestCard
              request={sampleRequest}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          {/* Compact Card View */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              2. Compact Card View
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Dense layout perfect for dashboards and overview screens with many items.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleRequests.slice(0, 3).map((request) => (
                <RequestCardCompact
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onClick={(id) => console.log(`Clicked request: ${id}`)}
                />
              ))}
            </div>
          </div>

          {/* List View */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              3. List View
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Table-like layout optimized for scanning many items quickly, with bulk selection support.
            </p>
            <Card>
              <CardContent className="p-0">
                {/* List Header */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  </div>
                  <div className="w-48">Document & Status</div>
                  <div className="w-32">Tracking #</div>
                  <div className="flex-1">Resident & Purpose</div>
                  <div className="w-24 text-right">Amount</div>
                  <div className="w-20">Date</div>
                  <div className="w-32">Actions</div>
                </div>

                {/* List Items */}
                <div>
                  {sampleRequests.map((request) => (
                    <RequestCardList
                      key={request.id}
                      request={request}
                      onViewDetails={handleViewDetails}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onClick={(id) => console.log(`Clicked request: ${id}`)}
                      onSelect={(id, selected) => console.log(`Select ${id}: ${selected}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>When to Use Each Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Standard Card</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Detailed review workflows</li>
                    <li>• Focus on individual requests</li>
                    <li>• Mobile-friendly interfaces</li>
                    <li>• When actions are primary</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">Compact Card</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Dashboard overviews</li>
                    <li>• Quick status monitoring</li>
                    <li>• Grid layouts with many items</li>
                    <li>• Space-constrained interfaces</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600">List View</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bulk operations</li>
                    <li>• Data comparison</li>
                    <li>• Sorting and filtering</li>
                    <li>• Administrative interfaces</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Container Component Demo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              RequestCardContainer Component
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Smart container that manages view switching, bulk selection, and consistent behavior across all variants.
            </p>
            
            <RequestCardContainer
              requests={sampleRequests}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestClick={(id) => console.log(`Navigate to request: ${id}`)}
              enableSelection={true}
              enableFiltering={true}
              onBulkAction={handleBulkAction}
              onFiltersChange={handleFiltersChange}
              showViewToggle={true}
              initialViewMode="card"
            />
          </div>

          {/* Container Features */}
          <Card>
            <CardHeader>
              <CardTitle>Container Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Built-in Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View mode switching (Card/Compact/List)</li>
                    <li>• Advanced filtering & search</li>
                    <li>• Multi-field sorting with direction</li>
                    <li>• Bulk selection and actions</li>
                    <li>• Date range and amount filtering</li>
                    <li>• Status and payment filters</li>
                    <li>• Real-time filter indicators</li>
                    <li>• Empty state management</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Filtering Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Text Search:</strong> Name, tracking #, purpose</li>
                    <li>• <strong>Status:</strong> Pending, approved, payment, ready</li>
                    <li>• <strong>Document Type:</strong> Dynamic from data</li>
                    <li>• <strong>Payment Status:</strong> Paid/unpaid</li>
                    <li>• <strong>Amount Range:</strong> Min/max values</li>
                    <li>• <strong>Date Range:</strong> Submission dates</li>
                    <li>• <strong>Sorting:</strong> 5 fields with asc/desc</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Usage Examples</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Basic with Filtering</h5>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`<RequestCardContainer
  requests={requests}
  onViewDetails={handleView}
  enableFiltering={true}
  onFiltersChange={handleFilters}
  initialViewMode="compact"
/>`}
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Full Featured</h5>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`<RequestCardContainer
  requests={requests}
  onViewDetails={handleView}
  onApprove={handleApprove}
  onReject={handleReject}
  enableSelection={true}
  enableFiltering={true}
  onBulkAction={handleBulk}
  onFiltersChange={handleFilters}
  showViewToggle={true}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};