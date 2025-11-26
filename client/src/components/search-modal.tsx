/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Clock, ArrowRight, Loader2, Users, UserCog, ClipboardList } from "lucide-react";
import { useFetchMyDocumentRequests } from "@/features/resident/hooks/useFetchMyDocumentRequests";
import { useFetchAvailableDocuments } from "@/features/resident/hooks/useFetchAvailableDocuments";
import { useFetchResidents } from "@/features/staff/hooks/useFetchResidents";
import { useFetchStaff } from "@/features/staff/hooks/useFetchStaff";
import { useFetchDocumentRequests } from "@/features/document/hooks/useFetchDocumentRequests";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useAuth();
  
  // Determine user role
  const isResident = user?.role === "resident";
  const isStaff = user?.role === "staff";
  const isAdmin = user?.role === "admin";
  const isStaffOrAdmin = isStaff || isAdmin;

  // Fetch data based on role
  const { data: myRequests, isLoading: isLoadingMyRequests } = useFetchMyDocumentRequests();
  const { data: documents, isLoading: isLoadingDocuments } = useFetchAvailableDocuments();
  const { data: residents, isLoading: isLoadingResidents } = useFetchResidents();
  const { data: staff, isLoading: isLoadingStaff } = useFetchStaff();
  const { data: allRequests, isLoading: isLoadingAllRequests } = useFetchDocumentRequests();

  // Filter results based on search query and role
  const filteredMyRequests = isResident ? (myRequests?.filter((req) =>
    req.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.status.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || []) : [];

  const filteredDocuments = documents?.filter((doc: any) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || [];

  const filteredResidents = isStaffOrAdmin ? (residents?.filter((resident) =>
    resident.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${resident.fullName}`.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || []) : [];

  const filteredStaff = isAdmin ? (staff?.filter((member) =>
    member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || []) : [];

  const filteredAllRequests = isStaffOrAdmin ? (allRequests?.filter((req) =>
    req.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.status.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || []) : [];

  const hasResults = filteredMyRequests.length > 0 || filteredDocuments.length > 0 || 
                     filteredResidents.length > 0 || filteredStaff.length > 0 || 
                     filteredAllRequests.length > 0;
  const isLoading = isLoadingMyRequests || isLoadingDocuments || isLoadingResidents || 
                    isLoadingStaff || isLoadingAllRequests;

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const handleRequestClick = (requestId: string) => {
    if (isResident) {
      navigate(`/resident/requests/${requestId}`);
    } else {
      navigate(`/staff/requests/${requestId}`);
    }
    onOpenChange(false);
  };

  const handleDocumentClick = (documentId: string) => {
    navigate("/resident/new-requests", {
      state: { preSelectedDocumentId: documentId }
    });
    onOpenChange(false);
  };

  const handleResidentClick = (residentId: string) => {
    navigate(`/staff/residents/${residentId}`);
    onOpenChange(false);
  };

  const handleStaffClick = (staffId: string) => {
    navigate(`/admin/staff/${staffId}`);
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case "approved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "payment_pending":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "payment_pending":
        return "Payment Pending";
      case "payment_verified":
        return "Payment Verified";
      case "ready_for_generation":
        return "Ready";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents and requests..."
              className="pl-10 h-12 border-0 focus-visible:ring-0 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto p-4 pt-2">
          {isLoading && searchQuery && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && searchQuery && !hasResults && (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}

          {!searchQuery && !isLoading && (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isResident && "Start typing to search documents and requests"}
                {isStaff && "Start typing to search requests, residents, and documents"}
                {isAdmin && "Start typing to search requests, residents, staff, and documents"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd/Ctrl + K</kbd> to open search
              </p>
            </div>
          )}

          {/* My Requests Results (Resident only) */}
          {!isLoading && searchQuery && filteredMyRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">My Requests</h3>
              <div className="space-y-2">
                {filteredMyRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleRequestClick(request.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      "hover:bg-accent hover:border-green-500"
                    )}
                  >
                    <div className="rounded-lg bg-green-100 dark:bg-green-950 p-2">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm truncate">{request.documentType}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-green-600 dark:text-green-400">
                          #{request.trackingNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(request.status))}>
                      {formatStatus(request.status)}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Requests Results (Staff/Admin) */}
          {!isLoading && searchQuery && filteredAllRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Document Requests</h3>
              <div className="space-y-2">
                {filteredAllRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleRequestClick(request.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      "hover:bg-accent hover:border-green-500"
                    )}
                  >
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-950 p-2">
                      <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm truncate">{request.documentType}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{request.residentName}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-mono text-green-600 dark:text-green-400">
                          #{request.trackingNumber}
                        </span>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(request.status))}>
                      {formatStatus(request.status)}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Residents Results (Staff/Admin) */}
          {!isLoading && searchQuery && filteredResidents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Residents</h3>
              <div className="space-y-2">
                {filteredResidents.map((resident) => (
                  <button
                    key={resident.id}
                    onClick={() => handleResidentClick(resident.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      "hover:bg-accent hover:border-green-500"
                    )}
                  >
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-950 p-2">
                      <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm truncate">
                        {resident.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{resident.email}</p>
                    </div>
                    <Badge variant={resident.verificationStatus ? "default" : "secondary"} className="text-xs">
                      {resident.verificationStatus ? "Verified" : "Pending"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Staff Results (Admin only) */}
          {!isLoading && searchQuery && filteredStaff.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Staff Members</h3>
              <div className="space-y-2">
                {filteredStaff.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleStaffClick(member.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      "hover:bg-accent hover:border-green-500"
                    )}
                  >
                    <div className="rounded-lg bg-orange-100 dark:bg-orange-950 p-2">
                      <UserCog className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {member.role}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available Documents Results */}
          {!isLoading && searchQuery && filteredDocuments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Available Documents</h3>
              <div className="space-y-2">
                {filteredDocuments.map((document: any) => (
                  <button
                    key={document.id}
                    onClick={() => handleDocumentClick(document.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      "hover:bg-accent hover:border-green-500"
                    )}
                  >
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-950 p-2">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm truncate">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.price === 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                        ) : (
                          `₱${document.price.toFixed(2)}`
                        )}
                        {" • "}
                        {document.processingTime}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
