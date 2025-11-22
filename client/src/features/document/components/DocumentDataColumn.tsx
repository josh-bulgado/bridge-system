import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { Document } from "../schema/documentSchema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import {
  IconCircleCheckFilled,
  IconX,
  IconToggleRight,
  IconToggleLeft,
  IconEye,
  IconDotsVertical,
  IconEdit,
  IconCopy,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    cell: ({ row }) => {
      const document = row.original;
      const isActive = document.status === "Active";

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {/* Toggle Active/Inactive */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${
                    isActive
                      ? "text-orange-600 hover:bg-orange-500 hover:text-white"
                      : "text-green-600 hover:bg-green-500 hover:text-white"
                  }`}
                  onClick={() => {
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 1000)),
                      {
                        loading: `${isActive ? "Deactivating" : "Activating"} ${document.name}`,
                        success: `${document.name} ${isActive ? "deactivated" : "activated"} successfully`,
                        error: "Failed to update status",
                      },
                    );
                  }}
                >
                  {isActive ? (
                    <IconToggleRight className="size-4" />
                  ) : (
                    <IconToggleLeft className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isActive ? "Deactivate" : "Activate"}
              </TooltipContent>
            </Tooltip>

            {/* View Details */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    toast(`Viewing details for ${document.name}`);
                  }}
                >
                  <IconEye className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <IconDotsVertical className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => toast(`Editing ${document.name}`)}
                >
                  <IconEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast(`Duplicating ${document.name}`)}
                >
                  <IconCopy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    toast.error(
                      `Delete ${document.name} - This would permanently remove the document`,
                    )
                  }
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      );
    },
  },
];
