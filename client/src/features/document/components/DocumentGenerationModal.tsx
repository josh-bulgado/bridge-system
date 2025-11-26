import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useGeneratePreview, useGenerateDocument } from "../hooks";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentRequestId: string;
  residentName: string;
  documentType: string;
}

export function DocumentGenerationModal({
  open,
  onOpenChange,
  documentRequestId,
  residentName,
  documentType,
}: DocumentGenerationModalProps) {
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [editedData, setEditedData] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"loading" | "editing" | "generating" | "success">("loading");

  const generatePreview = useGeneratePreview();
  const generateDocument = useGenerateDocument();

  // Load preview data when modal opens
  useEffect(() => {
    if (open && documentRequestId) {
      setStep("loading");
      
      // Use setTimeout to avoid state update during render
      const timer = setTimeout(() => {
        generatePreview.mutate(documentRequestId, {
          onSuccess: (data) => {
            setPreviewData(data.previewData);
            setEditedData(data.previewData);
            setStep("editing");
          },
          onError: (error: any) => {
            console.error("Error generating preview:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to load document data");
            setStep("editing");
            // Close modal on error
            setTimeout(() => onOpenChange(false), 2000);
          },
        });
      }, 0);

      return () => clearTimeout(timer);
    } else if (!open) {
      // Reset state when modal closes
      setStep("loading");
      setPreviewData({});
      setEditedData({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, documentRequestId]);

  const handleFieldChange = (key: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGenerate = () => {
    // Validate required fields
    const requiredFields = ["FULL_NAME", "AGE", "CIVIL_STATUS"];
    const missingFields = requiredFields.filter(
      (field) => !editedData[field] || editedData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setStep("generating");
    generateDocument.mutate(
      { documentRequestId, data: editedData },
      {
        onSuccess: () => {
          setStep("success");
          setTimeout(() => {
            onOpenChange(false);
            // Reset state
            setStep("loading");
            setPreviewData({});
            setEditedData({});
          }, 2000);
        },
        onError: () => {
          setStep("editing");
        },
      }
    );
  };

  const handleClose = () => {
    if (step !== "generating") {
      onOpenChange(false);
      // Reset state
      setTimeout(() => {
        setStep("loading");
        setPreviewData({});
        setEditedData({});
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Document
          </DialogTitle>
          <DialogDescription>
            Review and edit the document details for {residentName} - {documentType}
          </DialogDescription>
        </DialogHeader>

        {step === "loading" && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading document data...</p>
            </div>
          </div>
        )}

        {step === "editing" && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="font-semibold text-sm mb-3">Personal Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="FULL_NAME" className="flex items-center gap-1">
                  Full Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="FULL_NAME"
                  value={editedData.FULL_NAME || ""}
                  onChange={(e) => handleFieldChange("FULL_NAME", e.target.value)}
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="AGE" className="flex items-center gap-1">
                  Age
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="AGE"
                  type="number"
                  value={editedData.AGE || ""}
                  onChange={(e) => handleFieldChange("AGE", e.target.value)}
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CIVIL_STATUS" className="flex items-center gap-1">
                  Civil Status
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={editedData.CIVIL_STATUS || ""}
                  onValueChange={(value) => handleFieldChange("CIVIL_STATUS", value)}
                >
                  <SelectTrigger id="CIVIL_STATUS">
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address Information */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-3">Address Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="BARANGAY_NAME">Barangay</Label>
                <Input
                  id="BARANGAY_NAME"
                  value={editedData.BARANGAY_NAME || ""}
                  onChange={(e) => handleFieldChange("BARANGAY_NAME", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MUNICIPALITY">Municipality</Label>
                <Input
                  id="MUNICIPALITY"
                  value={editedData.MUNICIPALITY || ""}
                  onChange={(e) => handleFieldChange("MUNICIPALITY", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="PROVINCE">Province</Label>
                <Input
                  id="PROVINCE"
                  value={editedData.PROVINCE || ""}
                  onChange={(e) => handleFieldChange("PROVINCE", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Document Information */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-3">Document Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="DATE">Date Issued</Label>
                <Input
                  id="DATE"
                  value={editedData.DATE || ""}
                  onChange={(e) => handleFieldChange("DATE", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="OR_NO">Official Receipt Number</Label>
                <Input
                  id="OR_NO"
                  value={editedData.OR_NO || ""}
                  onChange={(e) => handleFieldChange("OR_NO", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CAPTAIN_NAME">Barangay Captain</Label>
                <Input
                  id="CAPTAIN_NAME"
                  value={editedData.CAPTAIN_NAME || ""}
                  onChange={(e) => handleFieldChange("CAPTAIN_NAME", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="PURPOSE">Purpose</Label>
                <Input
                  id="PURPOSE"
                  value={editedData.PURPOSE || ""}
                  onChange={(e) => handleFieldChange("PURPOSE", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Review all information carefully. Fields marked with{" "}
                <span className="text-red-500">*</span> are required. Grayed out fields are
                auto-filled from system configuration.
              </p>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Generating document...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few moments. Please wait.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
              <div>
                <p className="font-semibold text-lg">Document Generated Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  The document has been generated and is ready for download.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "editing" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={generateDocument.isPending}>
                {generateDocument.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
