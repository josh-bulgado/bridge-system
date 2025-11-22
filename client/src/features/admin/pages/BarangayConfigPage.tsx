import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { useSaveBarangayConfig } from "../hooks/useSaveBarangayConfig"; // SET hook
import { Loader2 } from "lucide-react";
import { useBarangayConfig } from "../hooks/useBarangayConfig";
import BarangayInformation from "../components/BarangayInformation";
import BarangayConfigForm from "../components/BarangayConfigForm";
import { useSaveBarangayConfig } from "../hooks/useSaveBarangayConfig";

const BarangayConfigPage: React.FC = () => {
  const { data: existingConfig, isLoading: isLoadingConfig } =
    useBarangayConfig(); // GET hook
  const { mutate: saveConfig, isLoading: isSaving } = useSaveBarangayConfig(); // SET hook

  const [isEditing, setIsEditing] = useState(false);

  // Handle saving the form data
  const handleSave = (data: any) => {
    saveConfig(data);
    setIsEditing(false); // Switch to static view after save
  };

  if (isLoadingConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Barangay Configuration</h1>
        {/* Only show the Edit button if the user is viewing the static data */}
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Configuration</Button>
        )}
        {/* Show Cancel Edit button if in editing mode */}
        {isEditing && existingConfig && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel Edit
          </Button>
        )}
      </div>

      {/* Render either the form or the static view based on isEditing */}
      {isEditing || !existingConfig ? (
        <BarangayConfigForm
          existingConfig={existingConfig}
          isLoading={isLoadingConfig}
          onSave={handleSave}
        />
      ) : (
        <BarangayInformation existingConfig={existingConfig} />
      )}
    </div>
  );
};

export default BarangayConfigPage;
