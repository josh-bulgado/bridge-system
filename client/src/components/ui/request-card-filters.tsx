import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface FilterOptions {
  search: string;
  status: string[];
  documentType: string[];
  paymentStatus: string[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface SortOptions {
  field: 'submittedAt' | 'amount' | 'residentName' | 'documentType' | 'status';
  direction: 'asc' | 'desc';
}

interface RequestCardFiltersProps {
  filters: FilterOptions;
  sorting: SortOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortingChange: (sorting: SortOptions) => void;
  onReset: () => void;
  availableDocumentTypes: string[];
  className?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending Review', color: 'bg-orange-100 text-orange-800' },
  { value: 'approved', label: 'Approved', color: 'bg-blue-100 text-blue-800' },
  { value: 'payment_pending', label: 'Payment Pending', color: 'bg-purple-100 text-purple-800' },
  { value: 'ready_for_generation', label: 'Ready for Generation', color: 'bg-blue-100 text-blue-800' },
];

const paymentStatusOptions = [
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'unpaid', label: 'Unpaid', color: 'bg-red-100 text-red-800' },
];

const sortFields = [
  { value: 'submittedAt', label: 'Date Submitted' },
  { value: 'amount', label: 'Amount' },
  { value: 'residentName', label: 'Resident Name' },
  { value: 'documentType', label: 'Document Type' },
  { value: 'status', label: 'Status' },
];

export const RequestCardFilters: React.FC<RequestCardFiltersProps> = ({
  filters,
  sorting,
  onFiltersChange,
  onSortingChange,
  onReset,
  availableDocumentTypes,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.documentType.length > 0) count++;
    if (filters.paymentStatus.length > 0) count++;
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, tracking number, or purpose..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
          {filters.search && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateFilters({ search: '' })}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <Select
              value={sorting.field}
              onValueChange={(field) => onSortingChange({ ...sorting, field: field as SortOptions['field'] })}
            >
              <SelectTrigger className="w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortFields.map(field => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onSortingChange({ 
                ...sorting, 
                direction: sorting.direction === 'asc' ? 'desc' : 'asc' 
              })}
              className="px-3"
            >
              {sorting.direction === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Reset */}
          {activeFilterCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-4 p-4 border rounded-lg bg-gray-50 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all",
                    filters.status.includes(status.value)
                      ? status.color
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => updateFilters({
                    status: toggleArrayFilter(filters.status, status.value)
                  })}
                >
                  {status.label}
                  {filters.status.includes(status.value) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Document Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Document Type</label>
            <div className="flex flex-wrap gap-2">
              {availableDocumentTypes.map(type => (
                <Badge
                  key={type}
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all",
                    filters.documentType.includes(type)
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => updateFilters({
                    documentType: toggleArrayFilter(filters.documentType, type)
                  })}
                >
                  {type}
                  {filters.documentType.includes(type) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Payment Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Payment Status</label>
            <div className="flex flex-wrap gap-2">
              {paymentStatusOptions.map(status => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all",
                    filters.paymentStatus.includes(status.value)
                      ? status.color
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => updateFilters({
                    paymentStatus: toggleArrayFilter(filters.paymentStatus, status.value)
                  })}
                >
                  {status.label}
                  {filters.paymentStatus.includes(status.value) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amount Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.amountRange.min || ''}
                onChange={(e) => updateFilters({
                  amountRange: {
                    ...filters.amountRange,
                    min: e.target.value ? Number(e.target.value) : null
                  }
                })}
                className="w-24"
              />
              <span className="self-center text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.amountRange.max || ''}
                onChange={(e) => updateFilters({
                  amountRange: {
                    ...filters.amountRange,
                    max: e.target.value ? Number(e.target.value) : null
                  }
                })}
                className="w-24"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "MMM dd, yyyy")
                    ) : (
                      "From date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => updateFilters({
                      dateRange: { ...filters.dateRange, from: date || null }
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "MMM dd, yyyy")
                    ) : (
                      "To date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => updateFilters({
                      dateRange: { ...filters.dateRange, to: date || null }
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateFilters({
                    dateRange: { from: null, to: null }
                  })}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ search: '' })}
              />
            </Badge>
          )}

          {filters.status.map(status => {
            const statusOption = statusOptions.find(s => s.value === status);
            return (
              <Badge key={status} variant="outline" className={cn("gap-1", statusOption?.color)}>
                {statusOption?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({
                    status: filters.status.filter(s => s !== status)
                  })}
                />
              </Badge>
            );
          })}

          {filters.documentType.map(type => (
            <Badge key={type} variant="outline" className="gap-1 bg-blue-100 text-blue-800">
              {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({
                  documentType: filters.documentType.filter(t => t !== type)
                })}
              />
            </Badge>
          ))}

          {filters.paymentStatus.map(status => {
            const paymentOption = paymentStatusOptions.find(s => s.value === status);
            return (
              <Badge key={status} variant="outline" className={cn("gap-1", paymentOption?.color)}>
                {paymentOption?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({
                    paymentStatus: filters.paymentStatus.filter(s => s !== status)
                  })}
                />
              </Badge>
            );
          })}

          {(filters.amountRange.min !== null || filters.amountRange.max !== null) && (
            <Badge variant="secondary" className="gap-1">
              Amount: {filters.amountRange.min || '0'} - {filters.amountRange.max || '∞'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({
                  amountRange: { min: null, max: null }
                })}
              />
            </Badge>
          )}

          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : '∞'} - {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : '∞'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({
                  dateRange: { from: null, to: null }
                })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};