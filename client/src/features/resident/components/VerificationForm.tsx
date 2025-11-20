import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type VerificationFormData } from "../schemas/verificationSchema";
import { AddressInformationSection } from "./AddressInformationSection";
import { DocumentUploadSection } from "./DocumentUploadSection";
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
  onUploadIdFront: (file: File, onChange: (url: string) => void) => void;
  onUploadIdBack: (file: File, onChange: (url: string) => void) => void;
  onUploadProof: (file: File, onChange: (url: string) => void) => void;
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
    <Card>
      <CardHeader>
        <CardTitle>Verification Form</CardTitle>
        <CardDescription>
          Please provide your address details and upload required documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Address Information */}
            <AddressInformationSection form={form} />

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
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your verification request will be
                reviewed by barangay staff. You will receive a notification
                once your account is verified (usually within 1-3 business
                days).
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Verification"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
