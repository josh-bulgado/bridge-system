import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { Document } from "../types/document";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { IconCircleCheckFilled, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { DocumentActionsCell } from "./DocumentActionsCell";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const columns: ColumnDef<Document>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Document Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="text-lg font-medium">
        {formatCurrency(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
    cell: ({ row }) => {
      const requirements = row.original.requirements;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Badge variant="outline">
                  {requirements.length} requirements
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-[250px] text-sm">
                <p className="mb-2 font-medium">Required Documents:</p>
                <ul className="list-inside list-disc space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className={
            status === "Active"
              ? "border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
              : "border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/20"
          }
        >
          {status === "Active" ? (
            <IconCircleCheckFilled className="mr-1 h-3 w-3 fill-green-500 dark:fill-green-400" />
          ) : (
            <IconX className="mr-1 h-3 w-3" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalRequests",
    header: "Statistics",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {document.totalRequests} requests
          </div>
          <div className="text-muted-foreground text-xs">
            {document.processingTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(row.original.lastModified)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DocumentActionsCell document={row.original} />,
  },
];
