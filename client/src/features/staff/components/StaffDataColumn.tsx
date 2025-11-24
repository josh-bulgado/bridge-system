import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { Staff } from "../types/staff";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { StaffActionsCell } from "./StaffActionsCell";

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRoleBadge(role: Staff["role"]) {
  switch (role) {
    case "admin":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
        >
          Admin
        </Badge>
      );
    case "staff":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
        >
          Staff
        </Badge>
      );
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
}

export const columns: ColumnDef<Staff>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="font-medium">{row.original.email}</div>,
  },
  {
    accessorKey: "authProvider",
    header: "Auth Provider",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.authProvider === "google" ? "Google" : "Local"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">{getRoleBadge(staff.role)}</div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>
                  {staff.role === "admin"
                    ? "Full admin privileges"
                    : "Staff member privileges"}
                </p>
                <p className="text-muted-foreground mt-1">
                  {staff.role === "admin"
                    ? "Can manage staff & residents"
                    : "Can manage residents only"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value: string) => {
      console.log("Filtering role with value:", value);
      if (!value) return true; // "" => All Status
      const status = row.getValue<string>(id);
      return status === value;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge
          variant="outline"
          className={
            isActive
              ? "border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
              : "border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/20"
          }
        >
          {isActive ? "✓ Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value: string) => {
      if (value === "all") return true; // "" => All Status
      const isActive = row.getValue<boolean>(id);
      return value === "active" ? isActive : !isActive; // "active" => false
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
              : "border-0 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          }
        >
          {isVerified ? "✓ Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <StaffActionsCell staff={row.original} />,
  },
];
