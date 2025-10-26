import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { ShieldCheck } from "lucide-react";

interface VerificationReminderProps {
  onVerifyClick?: () => void;
  onDismiss?: () => void;
  verificationPath?: string;
}

export const VerificationReminder: React.FC<VerificationReminderProps> = ({
  onVerifyClick,
  verificationPath = "/resident/verify",
}) => {
  const navigate = useNavigate();

  const handleVerifyClick = () => {
    if (onVerifyClick) {
      onVerifyClick();
    }
    navigate(verificationPath);
  };
  return (
    <Item
      variant="outline"
      className="border-l-4 border-orange-200 border-l-orange-500 bg-orange-50"
    >
      <ItemMedia variant="icon" className="border-orange-200 bg-orange-100">
        <ShieldCheck className="h-4 w-4 text-orange-600" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-orange-800">
          Verify Your Residency
        </ItemTitle>
        <ItemDescription className="text-orange-700">
          Please verify your residency to access all barangay services and
          submit requests. Verification ensures you're a legitimate resident
          of this barangay.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          className="bg-orange-600 text-white hover:bg-orange-700"
          onClick={handleVerifyClick}
        >
          Verify Now
        </Button>
      </ItemActions>
    </Item>
  );
};