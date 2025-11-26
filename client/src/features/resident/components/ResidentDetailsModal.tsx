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
import { UserCheck, UserX, ExternalLink, History, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApproveResidentVerification, useRejectResidentVerification } from "../hooks";
import { useFetchResidentById } from "../../staff/hooks";
import { RejectVerificationDialog } from "./RejectVerificationDialog";
import { DocumentViewer } from "@/components/ui/document-viewer";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { usePreloadResidentDocuments } from "../hooks/usePreloadResidentDocuments";
import { ResidentListItem } from "../../resident/services/residentService";

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

function getVerificationStatusBadge(status: ResidentListItem["verificationStatus"]) {
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
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const approveResidentMutation = useApproveResidentVerification();
  const rejectResidentMutation = useRejectResidentVerification();
  
  // Fetch fresh resident data when modal is open
  const { data: freshResidentData, refetch: refetchResident } = useFetchResidentById(resident?.id || "");
  
  // Use fresh data if available, otherwise use prop data
  const displayResident = (isOpen && freshResidentData) ? freshResidentData : resident;
  
  // Preload verification documents for instant display
  usePreloadResidentDocuments(displayResident, isOpen);
  
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

  // Check if there's verification history
  const hasHistory = displayResident.verificationHistory && displayResident.verificationHistory.length > 0;

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

        {/* Tabs for Current Submission and History */}
        <Tabs defaultValue="current" className="flex flex-col overflow-hidden">
          {/* Tabs List */}
          {hasHistory && (
            <div className="border-b px-6 py-2 bg-muted/20">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="current">Current Submission</TabsTrigger>
                <TabsTrigger value="history">Submission History</TabsTrigger>
              </TabsList>
            </div>
          )}

          {/* Current Submission Tab */}
          <TabsContent value="current" className="flex-1 m-0 overflow-hidden">
            <div className={cn(
              "flex overflow-hidden",
              canApproveReject ? "max-h-[calc(90vh-200px)]" : "max-h-[calc(90vh-140px)]"
            )}>
              {/* Left Column - Resident Details */}
              <ScrollArea className="w-1/2 border-r">
            <div className="space-y-4 px-6 py-4">
              {/* Personal Information */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Personal Information
                </Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <Label className="text-muted-foreground text-xs">Full Name</Label>
                    <p className="text-sm mt-0.5 font-medium">{displayResident.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Marital Status</Label>
                    <p className="text-sm mt-0.5">{displayResident.maritalStatus || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="text-sm mt-0.5">{displayResident.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Contact Number</Label>
                    <p className="text-sm mt-0.5">{formatPhoneNumber(displayResident.contactNumber)}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Address Info */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Address Information
                </Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <Label className="text-muted-foreground text-xs">House/Unit Number</Label>
                    <p className="text-sm mt-0.5">{displayResident.houseNumberUnit || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Street/Purok</Label>
                    <p className="text-sm mt-0.5">{displayResident.streetPurok || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Complete Address</Label>
                    <p className="text-sm mt-0.5">{displayResident.localAddress || "—"}</p>
                  </div>
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

                  {/* Right side - Proof of Residency for Current Submission */}
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
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-6 py-4 space-y-2">
                    {displayResident.verificationHistory && displayResident.verificationHistory.length > 0 ? (
                      displayResident.verificationHistory.map((entry, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedHistoryIndex(index)}
                          className="w-full border rounded-lg p-4 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  Submission #{displayResident.verificationHistory!.length - index}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted: {formatDate(entry.submittedAt)}
                                </p>
                                {entry.reviewedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Reviewed: {formatDate(entry.reviewedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getVerificationStatusBadge(entry.status as any)}
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No previous submissions
                      </p>
                    )}
                  </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>

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

      {/* History Details Dialog */}
      {selectedHistoryIndex !== null && displayResident.verificationHistory && (
        <Dialog open={selectedHistoryIndex !== null} onOpenChange={() => setSelectedHistoryIndex(null)}>
          <DialogContent className="max-h-[90vh] max-w-7xl p-0">
            {(() => {
              const entry = displayResident.verificationHistory![selectedHistoryIndex];
              const submissionNumber = displayResident.verificationHistory!.length - selectedHistoryIndex;
              
              return (
                <>
                  {/* Header */}
                  <div className="border-b bg-muted/30 px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <DialogTitle className="text-xl font-semibold">
                          Submission #{submissionNumber}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm">
                          {displayResident.fullName} • Submitted: {formatDate(entry.submittedAt)}
                          {entry.reviewedAt && ` • Reviewed: ${formatDate(entry.reviewedAt)}`}
                        </DialogDescription>
                      </div>
                      <div className="flex items-center pr-10">
                        {getVerificationStatusBadge(entry.status as any)}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="flex overflow-hidden max-h-[calc(90vh-140px)]">
                    {/* Left Column - Details */}
                    <div className="w-1/2 border-r flex flex-col overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="space-y-4 px-6 py-4 pb-8">
                          {/* Rejection Reason */}
                          {entry.status === "Rejected" && entry.rejectionReason && (
                            <>
                              <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3">
                                <p className="text-xs font-medium text-red-900 dark:text-red-200 mb-1">
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
                              <Label className="text-muted-foreground text-xs">House/Unit</Label>
                              <p className="text-sm mt-0.5">{entry.houseNumberUnit || "—"}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-xs">Street/Purok</Label>
                              <p className="text-sm mt-0.5">{entry.streetPurok || "—"}</p>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          {/* Government ID Documents */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">
                              Government ID Documents
                            </Label>
                            <div className="text-sm mb-3">
                              <Label className="text-muted-foreground text-xs">ID Type</Label>
                              <p className="text-sm mt-0.5">{formatGovernmentIdType(entry.governmentIdType)}</p>
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
                    <div className="w-1/2 flex flex-col bg-muted/20 overflow-hidden">
                      <div className="border-b px-6 py-3 bg-muted/30 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-semibold">Proof of Residency</Label>
                          {entry.proofOfResidencyType && (
                            <span className="text-xs text-muted-foreground">
                              {formatProofOfResidencyType(entry.proofOfResidencyType)}
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
                                window.open(entry.proofOfResidencyUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            Open in New Tab
                          </Button>
                        )}
                      </div>
                      <div className="flex-1 min-h-0 overflow-auto">
                        {entry.proofOfResidency ? (
                          <div className="h-full">
                            {console.log('History Proof of Residency:', {
                              publicId: entry.proofOfResidency,
                              url: entry.proofOfResidencyUrl,
                              fileType: entry.proofOfResidencyFileType,
                              residentId: displayResident.id
                            })}
                            <InlineDocumentViewer
                              title={formatProofOfResidencyType(entry.proofOfResidencyType)}
                              url={entry.proofOfResidencyUrl}
                              publicId={entry.proofOfResidency}
                              fileType={entry.proofOfResidencyFileType}
                              showDownload={userRole === "admin"}
                              residentId={displayResident.id}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground text-sm">No proof of residency submitted.</p>
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
