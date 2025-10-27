import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RequestCard } from "./request-card";
import { RequestCardCompact } from "./request-card-compact";
import { RequestCardList } from "./request-card-list";
import { RequestCardFilters, type FilterOptions, type SortOptions } from "./request-card-filters";
import { Grid3X3, List, LayoutGrid, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = 'card' | 'compact' | 'list';

interface RequestData {
  id: string;
  trackingNumber: string;
  documentType: string;
  residentName: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'payment_pending' | 'ready_for_generation';
  submittedAt: Date;
  paymentStatus?: 'paid' | 'unpaid';
}

interface RequestCardContainerProps {
  requests: RequestData[];
  onViewDetails: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestClick?: (id: string) => void;
  initialViewMode?: ViewMode;
  showViewToggle?: boolean;
  enableSelection?: boolean;
  enableFiltering?: boolean;
  onBulkAction?: (action: 'approve' | 'reject', ids: string[]) => void;
  onFiltersChange?: (filters: FilterOptions, filteredCount: number) => void;
  className?: string;
}

export const RequestCardContainer: React.FC<RequestCardContainerProps> = ({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  onRequestClick,
  initialViewMode = 'card',
  showViewToggle = true,
  enableSelection = false,
  enableFiltering = true,
  onBulkAction,
  onFiltersChange,
  className,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filter and Sort State
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: [],
    documentType: [],
    paymentStatus: [],
    amountRange: { min: null, max: null },
    dateRange: { from: null, to: null },
  });

  const [sorting, setSorting] = useState<SortOptions>({
    field: 'submittedAt',
    direction: 'desc',
  });

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === requests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(requests.map(r => r.id)));
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (onBulkAction && selectedIds.size > 0) {
      onBulkAction(action, Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  // Get available document types for filter
  const availableDocumentTypes = useMemo(() => {
    return Array.from(new Set(requests.map(r => r.documentType)));
  }, [requests]);

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests.filter(request => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          request.residentName,
          request.trackingNumber,
          request.purpose,
          request.documentType,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm)) {
          return false;
        }
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(request.status)) {
        return false;
      }

      // Document type filter
      if (filters.documentType.length > 0 && !filters.documentType.includes(request.documentType)) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus.length > 0) {
        const paymentStatus = request.paymentStatus || 'unpaid';
        if (!filters.paymentStatus.includes(paymentStatus)) {
          return false;
        }
      }

      // Amount range filter
      if (filters.amountRange.min !== null && request.amount < filters.amountRange.min) {
        return false;
      }
      if (filters.amountRange.max !== null && request.amount > filters.amountRange.max) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from && request.submittedAt < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to) {
        const endOfDay = new Date(filters.dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        if (request.submittedAt > endOfDay) {
          return false;
        }
      }

      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sorting.field];
      let bValue: any = b[sorting.field];

      // Handle different data types
      if (sorting.field === 'submittedAt') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (sorting.field === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sorting.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sorting.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [requests, filters, sorting]);

  // Notify parent of filter changes
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters, filteredAndSortedRequests.length);
    }
  }, [filters, filteredAndSortedRequests.length, onFiltersChange]);

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      status: [],
      documentType: [],
      paymentStatus: [],
      amountRange: { min: null, max: null },
      dateRange: { from: null, to: null },
    });
    setSorting({
      field: 'submittedAt',
      direction: 'desc',
    });
    setSelectedIds(new Set());
  };

  const viewModeConfig = {
    card: {
      icon: LayoutGrid,
      label: "Card View",
      description: "Detailed card layout"
    },
    compact: {
      icon: Grid3X3,
      label: "Compact View", 
      description: "Dense grid layout"
    },
    list: {
      icon: List,
      label: "List View",
      description: "Table-like layout"
    }
  };

  const renderRequests = () => {
    switch (viewMode) {
      case 'compact':
        return (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedRequests.map((request) => (
              <RequestCardCompact
                key={request.id}
                request={request}
                onViewDetails={onViewDetails}
                onApprove={onApprove}
                onReject={onReject}
                onClick={onRequestClick}
              />
            ))}
          </div>
        );

      case 'list':
        return (
          <Card>
            {enableSelection && selectedIds.size > 0 && (
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedIds.size} of {filteredAndSortedRequests.length} request{selectedIds.size > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction('approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve Selected
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('reject')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject Selected
                    </Button>
                  </div>
                </div>
              </CardHeader>
            )}
            <CardContent className="p-0">
              {/* List Header */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 uppercase tracking-wide">
                {enableSelection && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredAndSortedRequests.length && filteredAndSortedRequests.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                )}
                <div className="w-48">Document & Status</div>
                <div className="w-32">Tracking #</div>
                <div className="flex-1">Resident & Purpose</div>
                <div className="w-24 text-right">Amount</div>
                <div className="w-20">Date</div>
                <div className="w-32">Actions</div>
              </div>

              {/* List Items */}
              <div>
                {filteredAndSortedRequests.map((request) => (
                  <RequestCardList
                    key={request.id}
                    request={request}
                    onViewDetails={onViewDetails}
                    onApprove={onApprove}
                    onReject={onReject}
                    onClick={onRequestClick}
                    isSelected={enableSelection ? selectedIds.has(request.id) : false}
                    onSelect={enableSelection ? handleSelect : undefined}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default: // card
        return (
          <div className="space-y-4">
            {filteredAndSortedRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewDetails={onViewDetails}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters */}
      {enableFiltering && (
        <RequestCardFilters
          filters={filters}
          sorting={sorting}
          onFiltersChange={setFilters}
          onSortingChange={setSorting}
          onReset={handleFiltersReset}
          availableDocumentTypes={availableDocumentTypes}
        />
      )}

      {/* View Mode Toggle */}
      {showViewToggle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex rounded-lg border border-gray-200 p-1">
              {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
                const config = viewModeConfig[mode];
                const Icon = config.icon;
                return (
                  <Button
                    key={mode}
                    size="sm"
                    variant={viewMode === mode ? "default" : "ghost"}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "h-8 px-3 text-xs",
                      viewMode === mode 
                        ? "bg-gray-900 text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {filteredAndSortedRequests.length} of {requests.length} request{requests.length !== 1 ? 's' : ''}
            {filteredAndSortedRequests.length !== requests.length && ' (filtered)'}
          </div>
        </div>
      )}

      {/* Requests Display */}
      {renderRequests()}

      {/* Empty State */}
      {filteredAndSortedRequests.length === 0 && requests.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <LayoutGrid className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching requests</h3>
          <p className="text-gray-600 mb-4">
            No requests match your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="outline" onClick={handleFiltersReset}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* No Data State */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <LayoutGrid className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">
            No document requests match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};