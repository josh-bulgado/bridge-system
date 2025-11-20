

import { Eye, Loader2, Mail, UserCheck, UserX, Edit } from "lucide-react";
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

interface Resident {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  localAddress: string;
  verificationStatus: "Pending" | "Approved" | "Rejected" | "Under Review";
  isEmailVerified: boolean;
  registrationDate: string;
  verifiedDate: string | null;
  hasDocuments: boolean;
}

type ResidentActionType = "approve" | "reject" | "view" | "edit" | "contact";

// Sample data - replace with actual API call
const residents: Resident[] = [
  {
    id: "RES-001",
    fullName: "Juan Carlos dela Cruz",
    email: "juan.delacruz@email.com",
    contactNumber: "+63 917 123 4567",
    localAddress: "Purok 5, Mahogany Street",
    verificationStatus: "Pending",
    isEmailVerified: true,
    registrationDate: "2024-03-20",
    verifiedDate: null,
    hasDocuments: true,
  },
  {
    id: "RES-002",
    fullName: "Maria Santos Rodriguez",
    email: "maria.santos@gmail.com",
    contactNumber: "+63 918 987 6543",
    localAddress: "Block 2, Lot 15, Phase 1",
    verificationStatus: "Approved",
    isEmailVerified: true,
    registrationDate: "2024-03-18",
    verifiedDate: "2024-03-22",
    hasDocuments: true,
  },
  {
    id: "RES-003",
    fullName: "Roberto Martinez Jr.",
    email: "rob.martinez@yahoo.com",
    contactNumber: "+63 919 555 1234",
    localAddress: "Sitio Riverside, Area 3",
    verificationStatus: "Under Review",
    isEmailVerified: false,
    registrationDate: "2024-03-21",
    verifiedDate: null,
    hasDocuments: true,
  },
  {
    id: "RES-004",
    fullName: "Ana Beatriz Gonzales",
    email: "ana.gonzales@hotmail.com",
    contactNumber: "+63 920 777 8888",
    localAddress: "House 12, Purok 1",
    verificationStatus: "Rejected",
    isEmailVerified: true,
    registrationDate: "2024-03-19",
    verifiedDate: null,
    hasDocuments: false,
  },
  {
    id: "RES-005",
    fullName: "Miguel Antonio Reyes",
    email: "miguel.reyes@gmail.com",
    contactNumber: "+63 921 444 5555",
    localAddress: "Zone 4, Sampaguita Lane",
    verificationStatus: "Pending",
    isEmailVerified: false,
    registrationDate: "2024-03-23",
    verifiedDate: null,
    hasDocuments: false,
  },
];

function getVerificationStatusBadge(status: Resident["verificationStatus"]) {
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

function getEmailVerifiedBadge(isVerified: boolean) {
  return isVerified ? (
    <Badge
      variant="outline"
      className="border-0 bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400"
    >
      ✓ Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-0 bg-gray-500/15 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400"
    >
      Unverified
    </Badge>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ResidentListTable() {
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: ResidentActionType;
  } | null>(null);

  const isResidentActionPending = (
    action: ResidentActionType,
    residentId: string,
  ) => pendingAction?.id === residentId && pendingAction.type === action;

  const isResidentBusy = (residentId: string) =>
    pendingAction?.id === residentId;

  const handleAction = (resident: Resident, actionType: ResidentActionType) => {
    setPendingAction({ id: resident.id, type: actionType });
    setTimeout(() => {
      setPendingAction(null);
      console.log(
        `Action "${actionType}" completed for resident:`,
        resident.fullName,
      );
    }, 1000);
  };

  const renderResidentRow = (resident: Resident) => {
    const busy = isResidentBusy(resident.id);
    const approvePending = isResidentActionPending("approve", resident.id);
    const rejectPending = isResidentActionPending("reject", resident.id);

    return (
      <TableRow key={resident.id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-4 font-medium">
          <span>{resident.fullName}</span>
        </TableCell>

        <TableCell className="text-muted-foreground h-16 px-4 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{resident.email}</span>
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
        </TableCell>

        <TableCell className="text-muted-foreground h-16 px-4 text-sm">
          {resident.contactNumber}
        </TableCell>
        <TableCell className="h-16 px-4">
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
                    <p className="text-muted-foreground mt-1">
                      Not yet verified
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className="text-muted-foreground h-16 max-w-[250px] px-4 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block cursor-help truncate">
                  {resident.localAddress}
                </span>
              </TooltipTrigger>
              <TooltipContent>{resident.localAddress}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {/* Approve/Reject buttons for pending residents */}
              {(resident.verificationStatus === "Pending" ||
                resident.verificationStatus === "Under Review") && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:bg-green-500 hover:text-white"
                        onClick={() => handleAction(resident, "approve")}
                        disabled={busy}
                      >
                        {approvePending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <UserCheck className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Approve</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-500 hover:text-white"
                        onClick={() => handleAction(resident, "reject")}
                        disabled={busy}
                      >
                        {rejectPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <UserX className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reject</TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* View Details - always available */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(resident, "view")}
                    disabled={busy}
                  >
                    <Eye className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              {/* Edit - always available */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(resident, "edit")}
                    disabled={busy}
                  >
                    <Edit className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {/* Contact - always available */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(resident, "contact")}
                    disabled={busy}
                  >
                    <Mail className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Contact Resident</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-4 font-medium">Full Name</TableHead>
            <TableHead className="h-12 px-4 font-medium">Email</TableHead>
            <TableHead className="h-12 px-4 font-medium">Contact</TableHead>
            <TableHead className="h-12 w-[140px] px-4 font-medium">
              Status
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Local Address
            </TableHead>
            <TableHead className="h-12 w-[200px] px-4 font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{residents.map(renderResidentRow)}</TableBody>
      </Table>
    </div>
  );
}
