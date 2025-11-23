import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AccountSection } from "./AccountSection";
import { SecuritySection } from "./SecuritySection";
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
      <DialogContent className="flex h-[90vh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden p-0 md:h-[600px]">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg font-semibold md:text-xl">Settings</h2>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content: Sidebar + Content Area */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <nav
            className={cn(
              "bg-muted/20 flex-shrink-0 overflow-y-auto border-r p-3 transition-all duration-200",
              "bg-background md:bg-muted/20 absolute z-10 h-full w-full md:relative md:z-auto md:h-auto md:w-56",
              showSidebar ? "left-0" : "-left-full md:left-0",
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
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      activeSection === section.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
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
          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            {/* Mobile: Show back to menu button */}
            <button
              onClick={() => setShowSidebar(true)}
              className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm md:hidden"
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
