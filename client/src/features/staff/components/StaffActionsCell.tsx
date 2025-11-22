import * as React from "react";
import {
  Eye,
  Mail,
  UserCheck,
  UserX,
  Edit,
  KeyRound,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Staff } from "../types/staff";
import { useToggleStaffStatus, useDeleteStaff } from "../hooks";

interface StaffActionsCellProps {
  staff: Staff;
}

export function StaffActionsCell({ staff }: StaffActionsCellProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleStaffStatus();
  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff();

  const handleToggleStatus = () => {
    toggleStatus({
      id: staff.id,
      data: { isActive: !staff.isActive },
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteStaff(staff.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleAction = (actionType: string) => {
    // TODO: Implement other actions (view, edit, contact, resetPassword)
    console.log(`Action "${actionType}" for staff:`, staff.email);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("view")}
            disabled={isTogglingStatus}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("edit")}
            disabled={isTogglingStatus}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Staff
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {staff.isActive ? (
            <DropdownMenuItem
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className="text-red-600"
            >
              {isTogglingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserX className="mr-2 h-4 w-4" />
              )}
              Deactivate Account
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className="text-green-600"
            >
              {isTogglingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              Activate Account
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => handleAction("resetPassword")}
            disabled={isTogglingStatus}
            className="text-orange-600"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("contact")}
            disabled={isTogglingStatus}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Staff
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
            disabled={isTogglingStatus || isDeleting}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the staff account for "{staff.email}
              ". This action cannot be undone and will remove all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Staff"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
