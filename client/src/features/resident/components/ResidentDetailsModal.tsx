import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCheck, UserX, ExternalLink, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  useApproveResidentVerification,
  useRejectResidentVerification,
} from "../hooks";
import { RejectVerificationDialog } from "./RejectVerificationDialog";

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
  // Verification documents
  governmentIdFront?: string;
  governmentIdBack?: string;
  proofOfResidency?: string;
  streetPurok?: string;
  houseNumberUnit?: string;
}

interface ResidentDetailsModalProps {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  userRole: "staff" | "admin";
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getVerificationStatusBadge(status: Resident["verificationStatus"]) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300"
        >
          Pending
        </Badge>
      );
    case "Under Review":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400"
        >
          Under Review
        </Badge>
      );
    case "Approved":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400"
        >
          Approved
        </Badge>
      );
    case "Rejected":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400"
        >
          Rejected
        </Badge>
      );
  }
}

export default function ResidentDetailsModal({
  resident,
  isOpen,
  onClose,
  onRefresh,
}: ResidentDetailsModalProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const approveResidentMutation = useApproveResidentVerification();
  const rejectResidentMutation = useRejectResidentVerification();

  if (!resident) return null;

  const handleApprove = async () => {
    try {
      await approveResidentMutation.mutateAsync(resident.id);
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error approving resident:", error);
      // Error handling is done in the hook
    }
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (reason?: string) => {
    try {
      await rejectResidentMutation.mutateAsync({
        residentId: resident.id,
        reason,
      });
      setIsRejectDialogOpen(false);
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error approving resident:", error);
    }
  };

  const canApproveReject =
    resident.verificationStatus === "Pending" ||
    resident.verificationStatus === "Under Review";

  const isApproving = approveResidentMutation.isPending;
  const isRejecting = rejectResidentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogClose className="absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-2xl">Resident Details</DialogTitle>
          <DialogDescription>
            Review resident information and verification documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">
                  Full Name
                </Label>
                <p className="font-medium">{resident.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Contact Number
                </Label>
                <p className="font-medium">{resident.contactNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="font-medium">{resident.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Email Status
                </Label>
                <div className="mt-1">
                  {resident.isEmailVerified ? (
                    <Badge
                      variant="outline"
                      className="border-0 bg-green-500/15 text-green-700"
                    >
                      ✓ Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-0 bg-gray-500/15 text-gray-700"
                    >
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">
                  House Number/Unit
                </Label>
                <p className="font-medium">
                  {resident.houseNumberUnit || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Street/Purok
                </Label>
                <p className="font-medium">
                  {resident.streetPurok || "Not provided"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground text-sm">
                  Complete Address
                </Label>
                <p className="font-medium">{resident.localAddress}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Verification Status */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Verification Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Status</Label>
                <div className="mt-1">
                  {getVerificationStatusBadge(resident.verificationStatus)}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Registration Date
                </Label>
                <p className="font-medium">
                  {formatDate(resident.registrationDate)}
                </p>
              </div>
              {resident.verifiedDate && (
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Verified Date
                  </Label>
                  <p className="font-medium">
                    {formatDate(resident.verifiedDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Verification Documents */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Verification Documents
            </h3>
            {resident.hasDocuments ? (
              <div className="space-y-3">
                {resident.governmentIdFront && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Government ID (Front)
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Click to view document
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/api/FileUpload/${resident.governmentIdFront}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 size-4" />
                      View
                    </Button>
                  </div>
                )}
                {resident.governmentIdBack && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Government ID (Back)
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Click to view document
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/api/FileUpload/${resident.governmentIdBack}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 size-4" />
                      View
                    </Button>
                  </div>
                )}
                {resident.proofOfResidency && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Proof of Residency
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Click to view document
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/api/FileUpload/${resident.proofOfResidency}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 size-4" />
                      View
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No documents have been submitted yet.
              </p>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          {canApproveReject && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className="text-red-600 hover:bg-red-500 hover:text-white"
                onClick={handleRejectClick}
                disabled={isRejecting || isApproving}
              >
                <UserX className="mr-2 size-4" />
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
              >
                <UserCheck className="mr-2 size-4" />
                {isApproving ? "Approving..." : "Approve"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Reject Verification Dialog */}
      <RejectVerificationDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        residentName={resident.fullName}
        isLoading={isRejecting}
      />
    </Dialog>
  );
}
