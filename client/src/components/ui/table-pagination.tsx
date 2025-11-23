import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  itemLabel?: string;
  showFirstLast?: boolean;
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 25, 50, 100],
  itemLabel = "items",
  showFirstLast = true,
}: TablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground text-sm font-normal">
            Rows per page
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground text-sm">
          Showing <span className="font-medium">{startRow}</span> to{" "}
          <span className="font-medium">{endRow}</span> of{" "}
          <span className="font-medium">{totalRows}</span> {itemLabel}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-9 w-9 p-0"
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft className="size-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-9 w-9 p-0"
        >
          <span className="sr-only">Go to previous page</span>
          <IconChevronLeft className="size-4" />
        </Button>
        <div className="text-sm font-medium">
          Page {pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-9 w-9 p-0"
        >
          <span className="sr-only">Go to next page</span>
          <IconChevronRight className="size-4" />
        </Button>
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-9 w-9 p-0"
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
