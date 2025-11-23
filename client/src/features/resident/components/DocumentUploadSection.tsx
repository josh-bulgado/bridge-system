import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type VerificationFormData, GOVERNMENT_ID_TYPES, PROOF_OF_RESIDENCY_TYPES } from "../schemas/verificationSchema";
import { FileUploadZone } from "./FileUploadZone";
import { type UploadedFile } from "../services/verificationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

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
      <div>
        <h3 className="text-base font-semibold">Required Documents</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select document types and provide clear photos or scans
        </p>
      </div>

      {/* Government ID Section */}
      <div className="space-y-3 rounded-lg border p-3 bg-card">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Valid Government-Issued ID</h4>
            <p className="text-xs text-muted-foreground">
              Select ID type and upload both sides
            </p>
          </div>
        </div>

        {/* Government ID Type Selection */}
        <FormField
          control={form.control}
          name="governmentIdType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your government ID type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GOVERNMENT_ID_TYPES.map((idType) => (
                    <SelectItem key={idType.value} value={idType.value}>
                      {idType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Government ID Front */}
        <FormField
          control={form.control}
          name="governmentIdFront"
          render={({ field }) => (
            <FormItem>
              <FileUploadZone
                accept="image/*"
                label="ID Front Side"
                description="Upload a clear photo of the front side"
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
                label="ID Back Side"
                description="Upload a clear photo of the back side"
                uploaded={uploadedIdBack}
                uploading={uploadingIdBack}
                onUpload={(file) => onUploadIdBack(file, field.onChange)}
                onRemove={() => onRemoveIdBack(field.onChange)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Proof of Residency Section */}
      <div className="space-y-3 rounded-lg border p-3 bg-card">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Proof of Residency</h4>
            <p className="text-xs text-muted-foreground">
              Must show your current address within the barangay
            </p>
          </div>
        </div>

        {/* Proof of Residency Type Selection */}
        <FormField
          control={form.control}
          name="proofOfResidencyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your proof of residency type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROOF_OF_RESIDENCY_TYPES.map((proofType) => (
                    <SelectItem key={proofType.value} value={proofType.value}>
                      {proofType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Proof of Residency Upload */}
        <FormField
          control={form.control}
          name="proofOfResidency"
          render={({ field }) => (
            <FormItem>
              <FileUploadZone
                accept="image/*,application/pdf"
                label="Upload Document"
                description="Upload your proof of residency document (image or PDF)"
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
    </div>
  );
};
