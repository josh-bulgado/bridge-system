import { useState, useEffect } from "react";
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
import { UserCheck, UserX, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApproveResidentVerification, useRejectResidentVerification } from "../hooks";
import { useFetchResidentById } from "../../staff/hooks";
import { RejectVerificationDialog } from "./RejectVerificationDialog";
import { DocumentViewer } from "@/components/ui/document-viewer";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface Resident {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  localAddress: string;
  verificationStatus: "Not Submitted" | "Pending" | "Approved" | "Rejected" | "Under Review";
  isEmailVerified: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  registrationDate: string;
  verifiedDate: string | null;
  hasDocuments: boolean;
  // Verification documents
  governmentIdType?: string;
  governmentIdFront?: string;
  governmentIdFrontUrl?: string;
  governmentIdFrontFileType?: string;
  governmentIdBack?: string;
  governmentIdBackUrl?: string;
  governmentIdBackFileType?: string;
  proofOfResidencyType?: string;
  proofOfResidency?: string;
  proofOfResidencyUrl?: string;
  proofOfResidencyFileType?: string;
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
    case "Not Submitted":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-300"
        >
          Not Submitted
        </Badge>
      );
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

// Format government ID type for display
function formatGovernmentIdType(idType?: string): string {
  if (!idType) return '';
  
  const formattedTypes: Record<string, string> = {
    'philsys': 'PhilSys ID',
    'drivers_license': "Driver's License",
    'passport': 'Passport',
    'voters_id': "Voter's ID",
    'sss_id': 'SSS ID',
    'umid': 'UMID',
    'tin_id': 'TIN ID',
    'postal_id': 'Postal ID',
    'prc_id': 'PRC ID',
    'senior_citizen_id': 'Senior Citizen ID',
    'pwd_id': 'PWD ID',
    'national_id': 'National ID',
  };
  
  return formattedTypes[idType.toLowerCase()] || idType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format proof of residency type for display
function formatProofOfResidencyType(proofType?: string): string {
  if (!proofType) return '';
  
  const formattedTypes: Record<string, string> = {
    'barangay_certificate': 'Barangay Certificate',
    'barangay_clearance': 'Barangay Clearance',
    'utility_bill': 'Utility Bill',
    'lease_contract': 'Lease Contract',
    'tax_declaration': 'Tax Declaration',
    'cedula': 'Cedula',
    'certificate_of_residency': 'Certificate of Residency',
  };
  
  return formattedTypes[proofType.toLowerCase()] || proofType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format phone number to include +63 prefix
function formatPhoneNumber(phone?: string): string {
  if (!phone) return '';
  
  // Remove any existing +63, 63, or leading 0
  let cleanNumber = phone.replace(/^\+63/, '').replace(/^63/, '').replace(/^0/, '').trim();
  
  // If the number already starts with +, return as is
  if (phone.startsWith('+')) return phone;
  
  // Add +63 prefix if we have a valid number
  if (cleanNumber.length >= 10) {
    return `+63 ${cleanNumber}`;
  }
  
  // Return original if invalid
  return phone;
}

export default function ResidentDetailsModal({
  resident,
  isOpen,
  onClose,
  onRefresh,
  userRole,
}: ResidentDetailsModalProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const approveResidentMutation = useApproveResidentVerification();
  const rejectResidentMutation = useRejectResidentVerification();
  
  // Fetch fresh resident data when modal is open
  const { data: freshResidentData, refetch: refetchResident } = useFetchResidentById(resident?.id || "");
  
  // Use fresh data if available, otherwise use prop data
  const displayResident = (isOpen && freshResidentData) ? freshResidentData : resident;
  
  // Refetch when modal opens
  useEffect(() => {
    if (isOpen && resident?.id) {
      refetchResident();
    }
  }, [isOpen, resident?.id, refetchResident]);

  if (!displayResident) return null;

  const handleApprove = async () => {
    try {
      await approveResidentMutation.mutateAsync(displayResident.id);
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (reason?: string) => {
    try {
      await rejectResidentMutation.mutateAsync({ 
        residentId: displayResident.id,
        reason 
      });
      setIsRejectDialogOpen(false);
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const canApproveReject =
    displayResident.verificationStatus === "Pending" ||
    displayResident.verificationStatus === "Under Review";

  const isApproving = approveResidentMutation.isPending;
  const isRejecting = rejectResidentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-7xl p-0">
        {/* Header with Status Badge */}
        <div className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{displayResident.fullName}</DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {displayResident.email} • {formatPhoneNumber(displayResident.contactNumber)}
              </DialogDescription>
            </div>
            <div className="flex items-center pr-10">
              {getVerificationStatusBadge(displayResident.verificationStatus)}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={cn(
          "flex overflow-hidden",
          canApproveReject ? "max-h-[calc(90vh-200px)]" : "max-h-[calc(90vh-140px)]"
        )}>
          {/* Left Column - Resident Details */}
          <ScrollArea className="w-1/2 border-r">
            <div className="space-y-4 px-6 py-4">
              {/* Address Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <Label className="text-muted-foreground text-xs">House/Unit</Label>
                  <p className="text-sm mt-0.5">{displayResident.houseNumberUnit || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Street/Purok</Label>
                  <p className="text-sm mt-0.5">{displayResident.streetPurok || "—"}</p>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Timeline Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground text-xs">Registered</Label>
                  <p className="text-sm mt-0.5">{formatDate(displayResident.registrationDate)}</p>
                </div>
                {displayResident.verifiedDate && (
                  <div>
                    <Label className="text-muted-foreground text-xs">
                      {displayResident.verificationStatus === "Approved" ? "Approved" : 
                       displayResident.verificationStatus === "Rejected" ? "Rejected" : "Verified"}
                    </Label>
                    <p className="text-sm mt-0.5">{formatDate(displayResident.verifiedDate)}</p>
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              {/* Verification Documents */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Government ID Documents
                </Label>
                {displayResident.hasDocuments ? (
                  <div className="space-y-3">
                    {displayResident.governmentIdFront && (
                      <DocumentViewer
                        title={`${formatGovernmentIdType(displayResident.governmentIdType)} (Front)`}
                        url={displayResident.governmentIdFrontUrl}
                        publicId={displayResident.governmentIdFront}
                        fileType={displayResident.governmentIdFrontFileType}
                        showDownload={userRole === "admin"}
                        residentId={displayResident.id}
                      />
                    )}
                    {displayResident.governmentIdBack && (
                      <DocumentViewer
                        title={`${formatGovernmentIdType(displayResident.governmentIdType)} (Back)`}
                        url={displayResident.governmentIdBackUrl}
                        publicId={displayResident.governmentIdBack}
                        fileType={displayResident.governmentIdBackFileType}
                        showDownload={userRole === "admin"}
                        residentId={displayResident.id}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No documents submitted yet.</p>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Right Column - Proof of Residency */}
          <div className="w-1/2 flex flex-col bg-muted/20 overflow-hidden">
            <div className="border-b px-6 py-3 bg-muted/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Proof of Residency</Label>
                {displayResident.proofOfResidencyType && (
                  <span className="text-xs text-muted-foreground">
                    {formatProofOfResidencyType(displayResident.proofOfResidencyType)}
                  </span>
                )}
              </div>
              {displayResident.proofOfResidency && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    // Open the document in new tab
                    if (displayResident.proofOfResidencyUrl) {
                      window.open(displayResident.proofOfResidencyUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1.5" />
                  Open in New Tab
                </Button>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {displayResident.proofOfResidency ? (
                <div className="h-full">
                  <InlineDocumentViewer
                    title={formatProofOfResidencyType(displayResident.proofOfResidencyType)}
                    url={displayResident.proofOfResidencyUrl}
                    publicId={displayResident.proofOfResidency}
                    fileType={displayResident.proofOfResidencyFileType}
                    showDownload={userRole === "admin"}
                    residentId={displayResident.id}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">No proof of residency submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        {canApproveReject && (
          <div className="border-t bg-muted/30 px-6 py-4 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              onClick={handleRejectClick}
              disabled={isRejecting || isApproving}
            >
              <UserX className="mr-1.5 size-4" />
              Reject
            </Button>
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
            >
              <UserCheck className="mr-1.5 size-4" />
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Reject Verification Dialog */}
      <RejectVerificationDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        residentName={displayResident.fullName}
        isLoading={isRejecting}
      />
    </Dialog>
  );
}
