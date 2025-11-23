import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { ResidentListItem } from "../services/residentService";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ResidentActionsCell } from "./ResidentActionsCell";

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getVerificationStatusBadge(
  status: ResidentListItem["verificationStatus"],
) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
        >
          Pending
        </Badge>
      );
    case "Under Review":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
        >
          Under Review
        </Badge>
      );
    case "Approved":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
        >
          Approved
        </Badge>
      );
    case "Rejected":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
        >
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export const columns: ColumnDef<ResidentListItem>[] = [
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
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const resident = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground cursor-help text-sm">
                {resident.email}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>
                  {resident.isEmailVerified
                    ? "✓ Email Verified"
                    : "⚠ Email Unverified"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.contactNumber}
      </div>
    ),
  },
  {
    accessorKey: "verificationStatus",
    header: "Status",
    cell: ({ row }) => {
      const resident = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {getVerificationStatusBadge(resident.verificationStatus)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>Status: {resident.verificationStatus}</p>
                {resident.verifiedDate ? (
                  <p className="text-muted-foreground mt-1">
                    Verified: {formatDate(resident.verifiedDate)}
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-1">Not yet verified</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const isVerified = row.original.isEmailVerified;
      return (
        <Badge
          variant="outline"
          className={
            isVerified
              ? "border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
              : "border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/20"
          }
        >
          {isVerified ? "✓ Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "localAddress",
    header: "Local Address",
    cell: ({ row }) => {
      const address = row.original.localAddress;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground max-w-[250px] cursor-help truncate text-sm">
                {address}
              </div>
            </TooltipTrigger>
            <TooltipContent>{address}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(row.original.registrationDate)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ResidentActionsCell resident={row.original} />,
  },
];
