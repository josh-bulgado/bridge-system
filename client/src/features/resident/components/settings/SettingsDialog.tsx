import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AccountSection } from "./AccountSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SecuritySection } from "./SecuritySection";
import { VerificationStatusSection } from "./VerificationStatusSection";
import { GeneralSection } from "./GeneralSection";
import { User, Lock, CheckCircle, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections = [
  { id: "general", label: "General", icon: Settings },
  { id: "account", label: "Account", icon: UserCircle },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "verification", label: "Verification", icon: CheckCircle },
] as const;

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<string>("general");

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSection />;
      case "account":
        return <AccountSection />;
      case "personal":
        return <PersonalInfoSection />;
      case "security":
        return <SecuritySection />;
      case "verification":
        return <VerificationStatusSection onClose={() => onOpenChange(false)} />;
      default:
        return <GeneralSection />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[600px] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>

        {/* Main Content: Sidebar + Content Area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar Navigation */}
          <nav className="w-56 border-r bg-muted/20 p-3 overflow-y-auto flex-shrink-0">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
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
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
