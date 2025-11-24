import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

interface DataTableProps<TData> {
  table: TableType<TData>;
  isLoading: boolean;
  columnCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = ({ table, isLoading, columnCount }: DataTableProps<any>) => {
  const effectiveColumnCount = columnCount || table.getAllColumns().length;
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="h-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="h-12 px-4"
                    >
                      {header.isPlaceholder ? null : isLoading ? (
                        <Skeleton className="h-6 w-32" /> // Skeleton loader for header
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {/* Create a skeleton loader for each column in the row */}
                  {Array.from({ length: effectiveColumnCount }).map((_, columnIndex) => (
                    <TableCell key={columnIndex} className="h-16 px-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-16 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={effectiveColumnCount}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">No data found.</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
