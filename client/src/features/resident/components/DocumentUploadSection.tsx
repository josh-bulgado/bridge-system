import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type VerificationFormData } from "../schemas/verificationSchema";
import { FileUploadZone } from "./FileUploadZone";
import { type UploadedFile } from "../services/verificationService";

interface DocumentUploadSectionProps {
  form: UseFormReturn<VerificationFormData>;
  uploadedIdFront: UploadedFile | null;
  uploadedIdBack: UploadedFile | null;
  uploadedProof: UploadedFile | null;
  uploadingIdFront: boolean;
  uploadingIdBack: boolean;
  uploadingProof: boolean;
  onUploadIdFront: (file: File, onChange: (url: string) => void) => void;
  onUploadIdBack: (file: File, onChange: (url: string) => void) => void;
  onUploadProof: (file: File, onChange: (url: string) => void) => void;
  onRemoveIdFront: (onChange: (url: string) => void) => void;
  onRemoveIdBack: (onChange: (url: string) => void) => void;
  onRemoveProof: (onChange: (url: string) => void) => void;
}

export const DocumentUploadSection = ({
  form,
  uploadedIdFront,
  uploadedIdBack,
  uploadedProof,
  uploadingIdFront,
  uploadingIdBack,
  uploadingProof,
  onUploadIdFront,
  onUploadIdBack,
  onUploadProof,
  onRemoveIdFront,
  onRemoveIdBack,
  onRemoveProof,
}: DocumentUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Required Documents</h3>

      {/* Government ID Front */}
      <FormField
        control={form.control}
        name="governmentIdFront"
        render={({ field }) => (
          <FormItem>
            <FileUploadZone
              accept="image/*"
              label="Government ID (Front Side)"
              description="Upload a clear photo of the front side of your valid government ID"
              uploaded={uploadedIdFront}
              uploading={uploadingIdFront}
              onUpload={(file) => onUploadIdFront(file, field.onChange)}
              onRemove={() => onRemoveIdFront(field.onChange)}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Government ID Back */}
      <FormField
        control={form.control}
        name="governmentIdBack"
        render={({ field }) => (
          <FormItem>
            <FileUploadZone
              accept="image/*"
              label="Government ID (Back Side)"
              description="Upload a clear photo of the back side of your valid government ID"
              uploaded={uploadedIdBack}
              uploading={uploadingIdBack}
              onUpload={(file) => onUploadIdBack(file, field.onChange)}
              onRemove={() => onRemoveIdBack(field.onChange)}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Proof of Residency */}
      <FormField
        control={form.control}
        name="proofOfResidency"
        render={({ field }) => (
          <FormItem>
            <FileUploadZone
              accept="image/*,application/pdf"
              label="Proof of Residency"
              description="Upload any document showing your current address (Utility Bill, Lease Contract, Certificate of Residency, etc.)"
              uploaded={uploadedProof}
              uploading={uploadingProof}
              onUpload={(file) => onUploadProof(file, field.onChange)}
              onRemove={() => onRemoveProof(field.onChange)}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
