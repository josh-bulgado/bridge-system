import React from "react";
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
  onVerifyClick: () => void;
  onDismiss?: () => void;
}

export const VerificationReminder: React.FC<VerificationReminderProps> = ({
  onVerifyClick,
}) => {
  return (
    <Item
      variant="outline"
      className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50"
    >
      <ItemMedia
        variant="icon"
        className="border-orange-200 bg-orange-100 dark:border-orange-600 dark:bg-orange-900"
      >
        <ShieldCheck
          className="text-orange-600 dark:text-orange-200"
          size={16}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-orange-800 dark:text-orange-200">
          Verify Your Residency
        </ItemTitle>
        <ItemDescription className="text-orange-700 dark:text-orange-300">
          Please verify your residency to access all barangay services and
          submit requests. Verification ensures you're a legitimate resident of
          this barangay.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          className="bg-orange-600 text-white hover:bg-orange-700"
          onClick={onVerifyClick}
        >
          Verify Now
        </Button>
      </ItemActions>
    </Item>
  );
};
