import { Eye, Edit, Mail, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useResidents } from "@/features/staff/hooks/useResidents";
import { residentService } from "@/features/resident/services/residentService";
import ResidentDetailsModal from "@/features/resident/components/ResidentDetailsModal";

interface Resident {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  localAddress: string;
  verificationStatus: "Not Submitted" | "Pending" | "Approved" | "Rejected" | "Under Review";
  isEmailVerified: boolean;
  registrationDate: string;
  verifiedDate: string | null;
  hasDocuments: boolean;
}

interface ResidentListTableProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

function getVerificationStatusBadge(status: Resident["verificationStatus"]) {
  switch (status) {
    case "Not Submitted":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 dark:bg-gray-500/10 dark:text-gray-300 dark:hover:bg-gray-500/20"
        >
          Not Submitted
        </Badge>
      );
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

export default function ResidentListTable({
  searchTerm = "",
  onSearchChange,
}: ResidentListTableProps = {}) {
  const { residents, loading, error } = useResidents();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isContacting, setIsContacting] = useState(false);
  const [contactingResidentId, setContactingResidentId] = useState<
    string | null
  >(null);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  useEffect(() => {
    setFilteredResidents(residents);
  }, [residents]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResidents(residents);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = residents.filter(
      (resident) =>
        resident.fullName.toLowerCase().includes(searchLower) ||
        resident.email.toLowerCase().includes(searchLower) ||
        resident.localAddress.toLowerCase().includes(searchLower),
    );

    setFilteredResidents(filtered);
  }, [searchTerm, residents]);

  const handleViewDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  const handleEdit = (resident: Resident) => {
    // TODO: Implement edit functionality
    console.log("Edit resident:", resident.fullName);
  };

  const handleContact = (resident: Resident) => {
    setSelectedResident(resident);
    setShowContactForm(true);
  };

  const handleSendMessage = async () => {
    if (!selectedResident || !contactMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsContacting(true);
    setContactingResidentId(selectedResident.id);
    try {
      await residentService.contactResident(
        selectedResident.id,
        contactMessage,
      );
      toast.success(`Message sent to ${selectedResident.fullName}`);
      setContactMessage("");
      setShowContactForm(false);
      setSelectedResident(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsContacting(false);
      setContactingResidentId(null);
    }
  };

  const handleSelectResident = (residentId: string) => {
    // Scroll to the resident row
    const rowElement = rowRefs.current[residentId];
    if (rowElement) {
      rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add highlight effect
      rowElement.classList.add("bg-primary/10");
      setTimeout(() => {
        rowElement.classList.remove("bg-primary/10");
      }, 2000);
    }
  };

  const renderResidentRow = (resident: Resident) => {
    return (
      <TableRow
        key={resident.id}
        className="hover:bg-muted/50 transition-colors"
        ref={(el) => (rowRefs.current[resident.id] = el)}
      >
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
              {/* View Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(resident)}
                  >
                    <Eye className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              {/* Contact Resident */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleContact(resident)}
                  >
                    <Mail className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Contact Resident</TooltipContent>
              </Tooltip>

              {/* Edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(resident)}
                  >
                    <Edit className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
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
              <TableHead className="h-12 w-[160px] px-4 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="h-16 px-4">
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell className="h-16 px-4">
                  <Skeleton className="h-4 w-[180px]" />
                </TableCell>
                <TableCell className="h-16 px-4">
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell className="h-16 px-4">
                  <Skeleton className="h-6 w-[80px]" />
                </TableCell>
                <TableCell className="h-16 px-4">
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell className="h-16 px-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Error loading residents: {error}
        </p>
      </div>
    );
  }

  if (residents.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No residents found.</p>
      </div>
    );
  }

  return (
    <>
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
              <TableHead className="h-12 w-[160px] px-4 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResidents.length > 0 ? (
              filteredResidents.map(renderResidentRow)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground h-24 text-center"
                >
                  No residents found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resident Details Modal */}
      <ResidentDetailsModal
        resident={selectedResident}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={() => window.location.reload()}
        userRole="admin"
      />

      {/* Contact Resident Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Resident</DialogTitle>
            <DialogDescription>
              Send a message to {selectedResident?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Enter your message here..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowContactForm(false);
                  setContactMessage("");
                  setSelectedResident(null);
                }}
                disabled={isContacting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isContacting || !contactMessage.trim()}
              >
                {isContacting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 size-4" />
                )}
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
