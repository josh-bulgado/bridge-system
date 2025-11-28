/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCheck, UserX, ExternalLink, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useApproveResidentVerification,
  useRejectResidentVerification,
} from "../hooks";
import { useFetchResidentById } from "../../staff/hooks";
import { RejectVerificationDialog } from "./RejectVerificationDialog";
import { DocumentViewer } from "@/components/ui/document-viewer";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { usePreloadResidentDocuments } from "../hooks/usePreloadResidentDocuments";
import { type ResidentListItem } from "../services/residentService";

interface ResidentDetailsModalProps {
  resident: ResidentListItem | null;
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

function getVerificationStatusBadge(
  status: ResidentListItem["verificationStatus"],
) {
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
  if (!idType) return "";

  const formattedTypes: Record<string, string> = {
    philsys: "PhilSys ID",
    drivers_license: "Driver's License",
    passport: "Passport",
    voters_id: "Voter's ID",
    sss_id: "SSS ID",
    umid: "UMID",
    tin_id: "TIN ID",
    postal_id: "Postal ID",
    prc_id: "PRC ID",
    senior_citizen_id: "Senior Citizen ID",
    pwd_id: "PWD ID",
    national_id: "National ID",
  };

  return (
    formattedTypes[idType.toLowerCase()] ||
    idType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

// Format proof of residency type for display
function formatProofOfResidencyType(proofType?: string): string {
  if (!proofType) return "";

  const formattedTypes: Record<string, string> = {
    barangay_certificate: "Barangay Certificate",
    barangay_clearance: "Barangay Clearance",
    utility_bill: "Utility Bill",
    lease_contract: "Lease Contract",
    tax_declaration: "Tax Declaration",
    cedula: "Cedula",
    certificate_of_residency: "Certificate of Residency",
  };

  return (
    formattedTypes[proofType.toLowerCase()] ||
    proofType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

// Format phone number to include +63 prefix
function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";

  // Remove any existing +63, 63, or leading 0
  const cleanNumber = phone
    .replace(/^\+63/, "")
    .replace(/^63/, "")
    .replace(/^0/, "")
    .trim();

  // If the number already starts with +, return as is
  if (phone.startsWith("+")) return phone;

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
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<
    number | null
  >(null);
  const approveResidentMutation = useApproveResidentVerification();
  const rejectResidentMutation = useRejectResidentVerification();

  // Fetch fresh resident data when modal is open
  const { data: freshResidentData, refetch: refetchResident } =
    useFetchResidentById(resident?.id || "");

  // Use fresh data if available, otherwise use prop data
  const displayResident =
    isOpen && freshResidentData ? freshResidentData : resident;

  // Preload verification documents for instant display
  usePreloadResidentDocuments(displayResident, isOpen);

  // Refetch when modal opens
  useEffect(() => {
    if (isOpen && resident?.id) {
      refetchResident();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, resident?.id]);

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
        reason,
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

  // Check if there's verification history
  const hasHistory =
    displayResident.verificationHistory &&
    displayResident.verificationHistory.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-7xl p-0 flex flex-col">
        {/* Header with Status Badge */}
        <DialogHeader className="bg-muted/30 border-b px-6 py-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {displayResident.fullName}  
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {displayResident.email} •{" "}
                {formatPhoneNumber(displayResident.contactNumber)}
              </DialogDescription>
            </div>
            <div className="flex items-center pr-10">
              {getVerificationStatusBadge(displayResident.verificationStatus)}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs for Current Submission and History */}
        <Tabs defaultValue="current" className="flex flex-col min-h-0 flex-1">
          {/* Tabs List */}
          {hasHistory && (
            <div className="bg-muted/20 border-b px-6 py-2 shrink-0">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="current">Current Submission</TabsTrigger>
                <TabsTrigger value="history">Submission History</TabsTrigger>
              </TabsList>
            </div>
          )}

          {/* Current Submission Tab */}
          <TabsContent value="current" className="m-0 flex flex-col min-h-0 flex-1">
            <div className="flex min-h-0 flex-1 overflow-hidden">
              {/* Left Column - Resident Details */}
              <div className="w-1/2 border-r overflow-auto">
                <div className="space-y-4 px-6 py-4 pb-6">
                  {/* Personal Information */}
                  <div>
                    <Label className="mb-3 block text-sm font-medium">
                      Personal Information
                    </Label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Full Name
                        </Label>
                        <p className="mt-0.5 text-sm font-medium">
                          {displayResident.fullName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Civil Status
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {displayResident.civilStatus || "—"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Email
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {displayResident.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Contact Number
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {formatPhoneNumber(displayResident.contactNumber)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Address Info */}
                  <div>
                    <Label className="mb-3 block text-sm font-medium">
                      Address Information
                    </Label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          House/Unit Number
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {displayResident.houseNumberUnit || "—"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Street/Purok
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {displayResident.streetPurok || "—"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">
                          Complete Address
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {displayResident.localAddress || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Timeline Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Registered
                      </Label>
                      <p className="mt-0.5 text-sm">
                        {formatDate(displayResident.registrationDate)}
                      </p>
                    </div>
                    {displayResident.verifiedDate && (
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          {displayResident.verificationStatus === "Approved"
                            ? "Approved"
                            : displayResident.verificationStatus === "Rejected"
                              ? "Rejected"
                              : "Verified"}
                        </Label>
                        <p className="mt-0.5 text-sm">
                          {formatDate(displayResident.verifiedDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="my-3" />

                  {/* Verification Documents */}
                  <div>
                    <Label className="mb-3 block text-sm font-medium">
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
                      <p className="text-muted-foreground text-sm">
                        No documents submitted yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Proof of Residency for Current Submission */}
              <div className="bg-muted/20 flex w-1/2 flex-col min-h-0 overflow-hidden">
                <div className="bg-muted/30 flex shrink-0 items-center justify-between border-b px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold">
                      Proof of Residency
                    </Label>
                    {displayResident.proofOfResidencyType && (
                      <span className="text-muted-foreground text-xs">
                        {formatProofOfResidencyType(
                          displayResident.proofOfResidencyType,
                        )}
                      </span>
                    )}
                  </div>
                  {displayResident.proofOfResidency && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        if (displayResident.proofOfResidencyUrl) {
                          window.open(
                            displayResident.proofOfResidencyUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                    >
                      <ExternalLink className="mr-1.5 h-3 w-3" />
                      Open in New Tab
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {displayResident.proofOfResidency ? (
                    <div className="h-full min-h-[700px]">
                      <InlineDocumentViewer
                        title={formatProofOfResidencyType(
                          displayResident.proofOfResidencyType,
                        )}
                        url={displayResident.proofOfResidencyUrl}
                        publicId={displayResident.proofOfResidency}
                        fileType={displayResident.proofOfResidencyFileType}
                        showDownload={userRole === "admin"}
                        residentId={displayResident.id}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center min-h-[400px]">
                      <p className="text-muted-foreground text-sm">
                        No proof of residency submitted yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons for Current Submission - Inside Tab */}
            {canApproveReject && (
              <div className="bg-muted/30 flex items-center justify-end gap-3 border-t px-6 py-4 shrink-0">
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
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="m-0 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 px-6 py-4">
                {displayResident.verificationHistory &&
                displayResident.verificationHistory.length > 0 ? (
                  displayResident.verificationHistory.map((entry, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedHistoryIndex(index)}
                      className="hover:bg-muted/50 w-full rounded-lg border p-4 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">
                              Submission #
                              {displayResident.verificationHistory!.length -
                                index}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Submitted: {formatDate(entry.submittedAt)}
                            </p>
                            {entry.reviewedAt && (
                              <p className="text-muted-foreground text-xs">
                                Reviewed: {formatDate(entry.reviewedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getVerificationStatusBadge(entry.status as any)}
                          <ExternalLink className="text-muted-foreground h-4 w-4" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No previous submissions
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Reject Verification Dialog */}
      <RejectVerificationDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        residentName={displayResident.fullName}
        isLoading={isRejecting}
      />

      {/* History Details Dialog */}
      {selectedHistoryIndex !== null && displayResident.verificationHistory && (
        <Dialog
          open={selectedHistoryIndex !== null}
          onOpenChange={() => setSelectedHistoryIndex(null)}
        >
          <DialogContent className="max-h-[90vh] max-w-7xl p-0">
            {(() => {
              const entry =
                displayResident.verificationHistory![selectedHistoryIndex];
              const submissionNumber =
                displayResident.verificationHistory!.length -
                selectedHistoryIndex;

              return (
                <>
                  {/* Header */}
                  <div className="bg-muted/30 border-b px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <DialogTitle className="text-xl font-semibold">
                          Submission #{submissionNumber}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm">
                          {displayResident.fullName} • Submitted:{" "}
                          {formatDate(entry.submittedAt)}
                          {entry.reviewedAt &&
                            ` • Reviewed: ${formatDate(entry.reviewedAt)}`}
                        </DialogDescription>
                      </div>
                      <div className="flex items-center pr-10">
                        {getVerificationStatusBadge(entry.status as any)}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="flex max-h-[calc(90vh-140px)] overflow-hidden">
                    {/* Left Column - Details */}
                    <div className="flex w-1/2 flex-col overflow-hidden border-r">
                      <ScrollArea className="h-full">
                        <div className="space-y-4 px-6 py-4 pb-8">
                          {/* Rejection Reason */}
                          {entry.status === "Rejected" &&
                            entry.rejectionReason && (
                              <>
                                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                                  <p className="mb-1 text-xs font-medium text-red-900 dark:text-red-200">
                                    Rejection Reason:
                                  </p>
                                  <p className="text-sm text-red-800 dark:text-red-300">
                                    {entry.rejectionReason}
                                  </p>
                                </div>
                                <Separator className="my-3" />
                              </>
                            )}

                          {/* Address Info */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div>
                              <Label className="text-muted-foreground text-xs">
                                House/Unit
                              </Label>
                              <p className="mt-0.5 text-sm">
                                {entry.houseNumberUnit || "—"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-xs">
                                Street/Purok
                              </Label>
                              <p className="mt-0.5 text-sm">
                                {entry.streetPurok || "—"}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          {/* Government ID Documents */}
                          <div>
                            <Label className="mb-3 block text-sm font-medium">
                              Government ID Documents
                            </Label>
                            <div className="mb-3 text-sm">
                              <Label className="text-muted-foreground text-xs">
                                ID Type
                              </Label>
                              <p className="mt-0.5 text-sm">
                                {formatGovernmentIdType(entry.governmentIdType)}
                              </p>
                            </div>
                            <div className="space-y-3">
                              {entry.governmentIdFront && (
                                <DocumentViewer
                                  title={`${formatGovernmentIdType(entry.governmentIdType)} (Front)`}
                                  url={entry.governmentIdFrontUrl}
                                  publicId={entry.governmentIdFront}
                                  fileType={entry.governmentIdFrontFileType}
                                  showDownload={userRole === "admin"}
                                  residentId={displayResident.id}
                                />
                              )}
                              {entry.governmentIdBack && (
                                <DocumentViewer
                                  title={`${formatGovernmentIdType(entry.governmentIdType)} (Back)`}
                                  url={entry.governmentIdBackUrl}
                                  publicId={entry.governmentIdBack}
                                  fileType={entry.governmentIdBackFileType}
                                  showDownload={userRole === "admin"}
                                  residentId={displayResident.id}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Right Column - Proof of Residency */}
                    <div className="bg-muted/20 flex w-1/2 flex-col overflow-hidden">
                      <div className="bg-muted/30 flex shrink-0 items-center justify-between border-b px-6 py-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-semibold">
                            Proof of Residency
                          </Label>
                          {entry.proofOfResidencyType && (
                            <span className="text-muted-foreground text-xs">
                              {formatProofOfResidencyType(
                                entry.proofOfResidencyType,
                              )}
                            </span>
                          )}
                        </div>
                        {entry.proofOfResidency && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              if (entry.proofOfResidencyUrl) {
                                window.open(
                                  entry.proofOfResidencyUrl,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }
                            }}
                          >
                            <ExternalLink className="mr-1.5 h-3 w-3" />
                            Open in New Tab
                          </Button>
                        )}
                      </div>
                      <div className="min-h-0 flex-1 overflow-auto p-4">
                        {entry.proofOfResidency ? (
                          <div className="h-full min-h-[700px]">
                            <InlineDocumentViewer
                              title={formatProofOfResidencyType(
                                entry.proofOfResidencyType,
                              )}
                              url={entry.proofOfResidencyUrl}
                              publicId={entry.proofOfResidency}
                              fileType={entry.proofOfResidencyFileType}
                              showDownload={userRole === "admin"}
                              residentId={displayResident.id}
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center min-h-[400px]">
                            <p className="text-muted-foreground text-sm">
                              No proof of residency submitted.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
