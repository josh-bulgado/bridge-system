"use client";

import {
  Eye,
  Mail,
  UserCheck,
  UserX,
  Edit,
  KeyRound,
  Loader2,
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

import type { Staff } from "../types/staff";

type StaffActionType = "activate" | "deactivate" | "view" | "edit" | "contact" | "resetPassword";

interface StaffListTableProps {
  data: Staff[];
}

function getRoleBadge(role: Staff["role"]) {
  switch (role) {
    case "admin":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 border-0"
        >
          Admin
        </Badge>
      );
    case "staff":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border-0"
        >
          Staff
        </Badge>
      );
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
}

function getAccountStatusBadge(isActive: boolean) {
  return isActive ? (
    <Badge
      variant="outline"
      className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0"
    >
      ✓ Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-gray-500/15 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-0"
    >
      Inactive
    </Badge>
  );
}

function getEmailVerifiedBadge(isVerified: boolean) {
  return isVerified ? (
    <Badge
      variant="outline"
      className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0"
    >
      ✓ Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border-0"
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

export default function StaffListTable({ data }: StaffListTableProps) {
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: StaffActionType;
  } | null>(null);

  const isStaffActionPending = (action: StaffActionType, staffId: string) =>
    pendingAction?.id === staffId && pendingAction.type === action;

  const isStaffBusy = (staffId: string) => pendingAction?.id === staffId;

  const handleAction = (staff: Staff, actionType: StaffActionType) => {
    setPendingAction({ id: staff.id!, type: actionType });
    setTimeout(() => {
      setPendingAction(null);
      console.log(`Action "${actionType}" completed for staff:`, staff.email);
    }, 1000);
  };

  const renderStaffRow = (staff: Staff) => {
    const busy = isStaffBusy(staff.id!);
    const activatePending = isStaffActionPending("activate", staff.id!);
    const deactivatePending = isStaffActionPending("deactivate", staff.id!);
    const resetPasswordPending = isStaffActionPending("resetPassword", staff.id!);

    return (
      <TableRow key={staff.id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-4 font-medium">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  {staff.email.split('@')[0]}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>Auth Provider: {staff.authProvider}</p>
                  <p className="text-muted-foreground mt-1">
                    ID: {staff.id}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        
        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{staff.email}</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>Created: {formatDate(staff.createdAt)}</p>
                  <p className="text-muted-foreground mt-1">
                    Updated: {formatDate(staff.updatedAt)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        
        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          {staff.authProvider === "google" ? "Google Auth" : "—"}
        </TableCell>
        
        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  {getRoleBadge(staff.role)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>{staff.role === "admin" ? "Full admin privileges" : "Staff member privileges"}</p>
                  <p className="text-muted-foreground mt-1">
                    {staff.role === "admin" ? "Can manage staff & residents" : "Can manage residents only"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        
        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  {getAccountStatusBadge(staff.isActive)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>Account: {staff.isActive ? "Active" : "Inactive"}</p>
                  <p className="text-muted-foreground mt-1">
                    {staff.isActive ? "Can log in and access system" : "Cannot access system"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        
        <TableCell className="h-16 px-4">
          {getEmailVerifiedBadge(staff.isEmailVerified)}
        </TableCell>
        
        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          {formatDate(staff.createdAt)}
        </TableCell>
        
        <TableCell className="h-16 px-4">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {/* Activate/Deactivate toggle */}
              {!staff.isActive ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:bg-green-500 hover:text-white"
                      onClick={() => handleAction(staff, "activate")}
                      disabled={busy}
                    >
                      {activatePending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <UserCheck className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Activate Account</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-500 hover:text-white"
                      onClick={() => handleAction(staff, "deactivate")}
                      disabled={busy}
                    >
                      {deactivatePending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <UserX className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Deactivate Account</TooltipContent>
                </Tooltip>
              )}
              
              {/* Reset Password */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-orange-600 hover:bg-orange-500 hover:text-white"
                    onClick={() => handleAction(staff, "resetPassword")}
                    disabled={busy}
                  >
                    {resetPasswordPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <KeyRound className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Password</TooltipContent>
              </Tooltip>
              
              {/* View Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(staff, "view")}
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
                    onClick={() => handleAction(staff, "edit")}
                    disabled={busy}
                  >
                    <Edit className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Staff</TooltipContent>
              </Tooltip>
              
              {/* Contact */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(staff, "contact")}
                    disabled={busy}
                  >
                    <Mail className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Contact Staff</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="rounded-lg border bg-card ">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="h-12 px-4 font-medium">
              Username
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Email
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Auth Provider
            </TableHead>
            <TableHead className="h-12 px-4 font-medium w-[100px]">
              Role
            </TableHead>
            <TableHead className="h-12 px-4 font-medium w-[120px]">
              Status
            </TableHead>
            <TableHead className="h-12 px-4 font-medium w-[120px]">
              Email Verified
            </TableHead>
            <TableHead className="h-12 px-4 font-medium">
              Created Date
            </TableHead>
            <TableHead className="h-12 px-4 font-medium w-60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{data.map(renderStaffRow)}</TableBody>
      </Table>
    </div>
  );
}