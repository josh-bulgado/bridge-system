import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import DataTable from "@/components/data-table";
import { useState } from "react";

interface ResidentDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

export function ResidentDataTable<TData, TValue>({
  columns,
  data,
  isLoading
}: ResidentDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const fullName = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      const localAddress = row.getValue("localAddress") as string;

      return (
        fullName?.toLowerCase().includes(searchValue) ||
        email?.toLowerCase().includes(searchValue) ||
        localAddress?.toLowerCase().includes(searchValue)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Search by name/email/address */}
          <Input
            placeholder="Search by name, email, or address..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-10 w-[250px] lg:w-[350px]"
          />

          {/* Filter by verification status */}
          <Select
            value={
              (table
                .getColumn("verificationStatus")
                ?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => {
              table
                .getColumn("verificationStatus")
                ?.setFilterValue(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by email verification */}
          <Select
            value={
              (table
                .getColumn("isEmailVerified")
                ?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("isEmailVerified")?.setFilterValue(undefined);
              } else {
                table
                  .getColumn("isEmailVerified")
                  ?.setFilterValue(value === "verified");
              }
            }}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="Email Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Email Status</SelectItem>
              <SelectItem value="verified">Email Verified</SelectItem>
              <SelectItem value="unverified">Email Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Column visibility toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-10">
              <IconLayoutColumns className="mr-2 size-4" />
              Columns
              <IconChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <DataTable table={table} isLoading={isLoading}/>

      {/* Pagination */}
      <TablePagination table={table} itemLabel="residents" />
    </div>
  );
}
