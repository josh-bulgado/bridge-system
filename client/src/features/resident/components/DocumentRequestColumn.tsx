import type { ColumnDef } from "@tanstack/react-table";
import type { DocumentRequest } from "@/features/document/types/documentRequest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "@/lib/format";



// Status badge styling
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { className: string; label: string }> = {
    pending: {
      className: "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 dark:bg-yellow-500/10 dark:text-yellow-400",
      label: "Pending"
    },
    approved: {
      className: "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400",
      label: "Approved"
    },
    payment_pending: {
      className: "bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400",
      label: "Payment Pending"
    },
    payment_verified: {
      className: "bg-cyan-500/15 text-cyan-700 hover:bg-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-400",
      label: "Payment Verified"
    },
    ready_for_generation: {
      className: "bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/10 dark:text-purple-400",
      label: "Processing"
    },
    completed: {
      className: "bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400",
      label: "Completed"
    },
    rejected: {
      className: "bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400",
      label: "Rejected"
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant="outline" className={`border-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
};

export const columns: ColumnDef<DocumentRequest>[] = [
  {
    accessorKey: "trackingNumber",
    header: "Tracking Number",
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.original.trackingNumber}</div>
    ),
  },
  {
    accessorKey: "documentType",
    header: "Document Type",
    cell: ({ row }) => <div className="font-medium">{row.original.documentType}</div>,
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm text-muted-foreground capitalize">
        {row.original.purpose}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const formatted = formatCurrency(amount);
      return (
        <div className={`font-medium ${amount === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.paymentMethod === "online" ? "GCash" : "Cash on Pickup"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
    filterFn: (row, id, value: string) => {
      if (value === "all") return true;
      const status = row.getValue<string>(id);
      return status === value;
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Date Submitted",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.submittedAt)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button 
        variant="ghost" 
        size="sm"
        asChild
      >
        <Link to={`/resident/requests/${row.original.id}`}>
          <IconEye className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];
