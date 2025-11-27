import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { DocumentRequest } from "../types/documentRequest";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { DocumentRequestActionsCell } from "./DocumentRequestActionsCell";
import { formatCurrency } from "@/lib/format";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: DocumentRequest["status"]) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 dark:bg-yellow-500/10 dark:text-yellow-400 dark:hover:bg-yellow-500/20"
        >
          Pending Review
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
        >
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Rejected
        </Badge>
      );
    case "payment_pending":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
        >
          Payment Pending
        </Badge>
      );
    case "payment_verified":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
        >
          Payment Verified
        </Badge>
      );
    case "ready_for_generation":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
        >
          Ready for Generation
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
        >
          Processing
        </Badge>
      );
    case "ready_for_pickup":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-cyan-500/15 text-cyan-700 hover:bg-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20"
        >
          Ready for Pickup
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
        >
          Completed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export const columns: ColumnDef<DocumentRequest>[] = [
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
    accessorKey: "trackingNumber",
    header: "Tracking #",
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.original.trackingNumber}
      </div>
    ),
  },
  {
    accessorKey: "residentName",
    header: "Resident",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.residentName}</div>
        <div className="text-muted-foreground text-xs">
          {row.original.residentEmail}
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const residentName = row.getValue(id) as string;
      const residentEmail = row.original.residentEmail;
      return (
        residentName.toLowerCase().includes(value.toLowerCase()) ||
        residentEmail.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
  {
    accessorKey: "documentType",
    header: "Document Type",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.documentType}</div>
    ),
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => {
      const purpose = row.original.purpose;
      const maxLength = 30;
      const truncated = purpose.length > maxLength;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help text-sm capitalize">
                {truncated ? `${purpose.substring(0, maxLength)}...` : purpose}
              </div>
            </TooltipTrigger>
            {truncated && (
              <TooltipContent>
                <div className="max-w-[300px]">{purpose}</div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const formatted = formatCurrency(amount);
      return (
        <div
          className={`font-medium ${amount === 0 ? "text-green-600 dark:text-green-400" : ""}`}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const request = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help capitalize">
                {getStatusBadge(request.status)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Status:</strong> {request.status.replace(/_/g, " ")}
                </p>
                {request.rejectionReason && (
                  <p>
                    <strong>Reason:</strong> {request.rejectionReason}
                  </p>
                )}
                {request.notes && (
                  <p>
                    <strong>Notes:</strong> {request.notes}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDateTime(row.original.submittedAt)}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(row.original.updatedAt)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DocumentRequestActionsCell request={row.original} />,
  },
];
