import React from "react";
import { Button } from "@/components/ui/button";

import { MessageSquare, HelpCircle, ExternalLink } from "lucide-react";
import { useFetchBarangayConfig } from "@/features/admin/hooks/useFetchBarangayConfig";

interface DashboardFooterProps {
  onContactOffice?: () => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({
  onContactOffice,
}) => {
  const { data: config } = useFetchBarangayConfig();

  const isOfficeOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
  };

  const officeIsOpen = isOfficeOpen();

  return (
    <div className="mt-8 border-t border-border/40 pt-6 pb-6">
      <div className="space-y-6">
        {/* Footer Links and Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Help Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onContactOffice}
              className="text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Office
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Open help modal or navigate to help page
                window.open("/resident/requests", "_self");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                FAQs
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </div>

          {/* Copyright/Info */}
          <div className="text-xs text-muted-foreground text-center sm:text-right">
            © {new Date().getFullYear()} Barangay Management System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
