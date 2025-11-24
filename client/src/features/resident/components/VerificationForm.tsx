import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type VerificationFormData } from "../schemas/verificationSchema";
import { AddressInformationSection } from "./AddressInformationSection";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { DocumentTypeInfo } from "./DocumentTypeInfo";
import { type UploadedFile } from "../services/verificationService";

interface VerificationFormProps {
  form: UseFormReturn<VerificationFormData>;
  onSubmit: (data: VerificationFormData) => void;
  isSubmitting: boolean;
  uploadedIdFront: UploadedFile | null;
  uploadedIdBack: UploadedFile | null;
  uploadedProof: UploadedFile | null;
  uploadingIdFront: boolean;
  uploadingIdBack: boolean;
  uploadingProof: boolean;
  onUploadIdFront: (file: File, onChange: (url: string) => void, urlOnChange: (url: string) => void, fileTypeOnChange: (fileType: string) => void) => void;
  onUploadIdBack: (file: File, onChange: (url: string) => void, urlOnChange: (url: string) => void, fileTypeOnChange: (fileType: string) => void) => void;
  onUploadProof: (file: File, onChange: (url: string) => void, urlOnChange: (url: string) => void, fileTypeOnChange: (fileType: string) => void) => void;
  onRemoveIdFront: (onChange: (url: string) => void) => void;
  onRemoveIdBack: (onChange: (url: string) => void) => void;
  onRemoveProof: (onChange: (url: string) => void) => void;
}

export const VerificationForm = ({
  form,
  onSubmit,
  isSubmitting,
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
}: VerificationFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Address Information */}
        <AddressInformationSection form={form} />

        {/* Document Requirements Info */}
        <DocumentTypeInfo />

        {/* Document Upload */}
        <DocumentUploadSection
          form={form}
          uploadedIdFront={uploadedIdFront}
          uploadedIdBack={uploadedIdBack}
          uploadedProof={uploadedProof}
          uploadingIdFront={uploadingIdFront}
          uploadingIdBack={uploadingIdBack}
          uploadingProof={uploadingProof}
          onUploadIdFront={onUploadIdFront}
          onUploadIdBack={onUploadIdBack}
          onUploadProof={onUploadProof}
          onRemoveIdFront={onRemoveIdFront}
          onRemoveIdBack={onRemoveIdBack}
          onRemoveProof={onRemoveProof}
        />

        {/* Information Note */}
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Your verification request will be reviewed by barangay staff. You will receive a notification once verified (usually within 1-3 business days).
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Verification"}
        </Button>
      </form>
    </Form>
  );
};
