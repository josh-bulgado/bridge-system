import { Eye, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ResidentListItem } from "../services/residentService";
import ResidentDetailsModal from "./ResidentDetailsModal";
import { Loader2 } from "lucide-react";
import { useContactResident } from "../../staff/hooks/useContactResident";
import { useAuth } from "../../auth/hooks/useAuth";

interface ResidentActionsCellProps {
  resident: ResidentListItem;
}

export function ResidentActionsCell({ resident }: ResidentActionsCellProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const contactMutation = useContactResident();
  const { data: user } = useAuth();
  
  // Determine if current user is admin
  const isAdmin = user?.role === "admin";

  const handleViewDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handleContact = () => {
    setShowContactForm(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      return;
    }

    contactMutation.mutate(
      { id: resident.id, message: contactMessage },
      {
        onSuccess: () => {
          setContactMessage("");
          setShowContactForm(false);
        },
      },
    );
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {/* View Details - Available to all roles */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleViewDetails}
              >
                <Eye className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>

          {/* Contact Resident - Available to all roles */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleContact}
              >
                <Mail className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Contact Resident</TooltipContent>
          </Tooltip>

          {/* More Actions - Admin Only */}
          {isAdmin && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>More Actions</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-muted-foreground">
                    No additional actions available
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TooltipProvider>

      {/* Resident Details Modal */}
      <ResidentDetailsModal
        resident={resident}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onRefresh={() => window.location.reload()}
        userRole={user?.role === "admin" ? "admin" : "staff"}
      />

      {/* Contact Resident Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Resident</DialogTitle>
            <DialogDescription>
              Send a message to {resident.fullName}
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
                }}
                disabled={contactMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={contactMutation.isPending || !contactMessage.trim()}
              >
                {contactMutation.isPending ? (
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
