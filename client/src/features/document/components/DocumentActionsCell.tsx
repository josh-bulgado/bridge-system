import * as React from "react";
import { Button } from "@/components/ui/button";
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
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import {
  IconToggleRight,
  IconToggleLeft,
  IconEdit,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import {
  useToggleDocumentStatus,
  useDeleteDocument,
  useDuplicateDocument,
} from "../hooks";
import type { Document } from "../types/document";
import { EditDocumentSheet } from "./EditDocumentSheet";

interface DocumentActionsCellProps {
  document: Document;
}

export function DocumentActionsCell({ document }: DocumentActionsCellProps) {
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleDocumentStatus();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();
  const { mutate: duplicateDocument, isPending: isDuplicating } =
    useDuplicateDocument();

  const isActive = document.status === "Active";

  const handleToggleStatus = () => {
    const newStatus = isActive ? "Inactive" : "Active";
    toggleStatus({ id: document.id, data: { status: newStatus } });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteDocument(document.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleDuplicate = () => {
    duplicateDocument(document.id);
  };

  const handleEdit = () => {
    setEditSheetOpen(true);
  };

  return (
    <>
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
                onClick={handleToggleStatus}
                disabled={isToggling}
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

          {/* Edit */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleEdit}
              >
                <IconEdit className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          {/* Duplicate */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDuplicate}
                disabled={isDuplicating}
              >
                <IconCopy className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDuplicating ? "Duplicating..." : "Duplicate"}
            </TooltipContent>
          </Tooltip>

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600 hover:bg-red-500 hover:text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <IconTrash className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDeleting ? "Deleting..." : "Delete"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Edit Document Sheet */}
      <EditDocumentSheet
        document={document}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{document.name}". This action cannot
              be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
