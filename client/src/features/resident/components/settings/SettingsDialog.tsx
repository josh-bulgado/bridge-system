import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AccountSection } from "./AccountSection";
import { SecuritySection } from "./SecuritySection";
import { VerificationStatusSection } from "./VerificationStatusSection";
import { GeneralSection } from "./GeneralSection";
import { Lock, CheckCircle, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections = [
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Lock },
  { id: "verification", label: "Verification", icon: CheckCircle },
  { id: "account", label: "Account", icon: UserCircle },
] as const;

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<string>("general");
  const [showSidebar, setShowSidebar] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSection />;
      case "account":
        return <AccountSection />;
      case "security":
        return <SecuritySection />;
      case "verification":
        return <VerificationStatusSection onClose={() => onOpenChange(false)} />;
      default:
        return <GeneralSection />;
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // On mobile, hide sidebar after selecting a section
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] md:h-[600px] p-0 gap-0 overflow-hidden flex flex-col w-[95vw]">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b flex-shrink-0 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Settings</h2>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content: Sidebar + Content Area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar Navigation */}
          <nav
            className={cn(
              "border-r bg-muted/20 p-3 overflow-y-auto flex-shrink-0 transition-all duration-200",
              "w-full md:w-56 absolute md:relative z-10 md:z-auto h-full md:h-auto bg-background md:bg-muted/20",
              showSidebar ? "left-0" : "-left-full md:left-0"
            )}
          >
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      activeSection === section.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
            {/* Mobile: Show back to menu button */}
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Back to Menu
            </button>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
