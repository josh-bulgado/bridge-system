import {
  Eye,
  Loader2,
  Edit,
  Plus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Document {
  id: string;
  name: string;
  description: string;
  price: number;
  requirements: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
  totalRequests: number;
  processingTime: string; // e.g., "3-5 business days"
}

type DocumentActionType = "view" | "edit" | "toggle" | "duplicate";

// Sample data - replace with actual API call
const documents: Document[] = [
  {
    id: "DOC-001",
    name: "Barangay Clearance",
    description: "Certificate of good moral character and residence",
    price: 50.0,
    requirements: ["Valid ID", "Proof of Residency", "Barangay ID Photo"],
    isActive: true,
    createdDate: "2024-01-15",
    lastModified: "2024-03-20",
    totalRequests: 156,
    processingTime: "1-2 business days",
  },
  {
    id: "DOC-002",
    name: "Certificate of Indigency",
    description: "Document certifying low-income status for various purposes",
    price: 30.0,
    requirements: [
      "Valid ID",
      "Proof of Residency",
      "Income Statement",
      "Barangay ID Photo",
    ],
    isActive: true,
    createdDate: "2024-01-15",
    lastModified: "2024-02-28",
    totalRequests: 89,
    processingTime: "2-3 business days",
  },
  {
    id: "DOC-003",
    name: "Business Permit",
    description: "Permit for operating small businesses within barangay",
    price: 200.0,
    requirements: [
      "Valid ID",
      "Business Plan",
      "Proof of Location",
      "Tax Clearance",
      "Barangay ID Photo",
    ],
    isActive: true,
    createdDate: "2024-01-20",
    lastModified: "2024-03-15",
    totalRequests: 34,
    processingTime: "5-7 business days",
  },
  {
    id: "DOC-004",
    name: "Residency Certificate",
    description: "Official proof of residence within the barangay",
    price: 25.0,
    requirements: ["Valid ID", "Proof of Residency", "Barangay ID Photo"],
    isActive: false,
    createdDate: "2024-02-01",
    lastModified: "2024-03-10",
    totalRequests: 67,
    processingTime: "1-2 business days",
  },
  {
    id: "DOC-005",
    name: "Complaint Certificate",
    description: "Document for filing complaints or legal matters",
    price: 75.0,
    requirements: [
      "Valid ID",
      "Incident Report",
      "Witness Statements",
      "Supporting Documents",
      "Barangay ID Photo",
    ],
    isActive: true,
    createdDate: "2024-02-10",
    lastModified: "2024-03-18",
    totalRequests: 23,
    processingTime: "3-5 business days",
  },
];

function getStatusBadge(isActive: boolean) {
  return isActive ? (
    <Badge
      variant="outline"
      className="border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
    >
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/20"
    >
      Inactive
    </Badge>
  );
}

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

export default function DocumentListTable() {
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: DocumentActionType;
  } | null>(null);

  const isDocumentActionPending = (
    action: DocumentActionType,
    documentId: string,
  ) => pendingAction?.id === documentId && pendingAction.type === action;

  const isDocumentBusy = (documentId: string) =>
    pendingAction?.id === documentId;

  const handleAction = (document: Document, actionType: DocumentActionType) => {
    setPendingAction({ id: document.id, type: actionType });
    setTimeout(() => {
      setPendingAction(null);
      console.log(
        `Action "${actionType}" completed for document:`,
        document.name,
      );
    }, 1000);
  };

  const renderDocumentRow = (document: Document) => {
    const busy = isDocumentBusy(document.id);
    const togglePending = isDocumentActionPending("toggle", document.id);

    return (
      <TableRow key={document.id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-4 font-medium">
          <div>
            <span className="font-medium">{document.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground max-w-[200px] cursor-help truncate text-sm">
                    {document.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[300px]">{document.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>

        <TableCell className="h-16 px-4 text-lg font-medium">
          {formatCurrency(document.price)}
        </TableCell>

        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Badge variant="outline" className="mb-1">
                    {document.requirements.length} requirements
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] text-sm">
                  <p className="mb-2 font-medium">Required Documents:</p>
                  <ul className="list-inside list-disc space-y-1">
                    {document.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>

        <TableCell className="h-16 px-4">
          {getStatusBadge(document.isActive)}
        </TableCell>

        <TableCell className="text-muted-foreground h-16 px-4 text-sm">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {document.totalRequests} requests
            </div>
            <div className="text-xs">{document.processingTime}</div>
          </div>
        </TableCell>

        <TableCell className="text-muted-foreground h-16 px-4 text-sm">
          <div className="space-y-1">
            <div className="text-xs">Modified:</div>
            <div>{formatDate(document.lastModified)}</div>
          </div>
        </TableCell>

        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {/* Toggle Active/Inactive */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 ${
                      document.isActive
                        ? "text-orange-600 hover:bg-orange-500 hover:text-white"
                        : "text-green-600 hover:bg-green-500 hover:text-white"
                    }`}
                    onClick={() => handleAction(document, "toggle")}
                    disabled={busy}
                  >
                    {togglePending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : document.isActive ? (
                      <ToggleRight className="size-4" />
                    ) : (
                      <ToggleLeft className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {document.isActive ? "Deactivate" : "Activate"}
                </TooltipContent>
              </Tooltip>

              {/* View Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(document, "view")}
                    disabled={busy}
                  >
                    <Eye className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              {/* Edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(document, "edit")}
                    disabled={busy}
                  >
                    <Edit className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Document</TooltipContent>
              </Tooltip>

              {/* Duplicate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(document, "duplicate")}
                    disabled={busy}
                  >
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate Document</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="bg-card rounded-lg border ">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-4 font-medium">
              Document Name
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">Price</TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Requirements
            </TableHead>
            <TableHead className="h-12 w-[100px] px-4 font-medium">
              Status
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">Statistics</TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Last Modified
            </TableHead>
            <TableHead className="h-12 w-[180px] px-4 font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{documents.map(renderDocumentRow)}</TableBody>
      </Table>
    </div>
  );
}
