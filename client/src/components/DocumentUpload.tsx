
import { useUploadDocument, useUploadVerificationDocument } from "@/hooks/useUploadFile";
import { FileUploader } from "./FileUploader";

interface DocumentUploadProps {
  folder?: string;
  onUploadSuccess?: (url: string, publicId: string) => void;
  isVerificationDocument?: boolean;
  maxSize?: number;
  label?: string;
  description?: string;
}

export function DocumentUpload({
  folder = "documents",
  onUploadSuccess,
  isVerificationDocument = false,
  maxSize = 20,
  label,
  description,
}: DocumentUploadProps) {
  const uploadDocumentMutation = useUploadDocument();
  const uploadVerificationMutation = useUploadVerificationDocument();

  const handleUpload = async (file: File) => {
    try {
      let result;

      if (isVerificationDocument) {
        result = await uploadVerificationMutation.mutateAsync(file);
      } else {
        result = await uploadDocumentMutation.mutateAsync({ file, folder });
      }

      if (onUploadSuccess) {
        onUploadSuccess(result.url, result.publicId);
      }

      return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <FileUploader
      onUpload={handleUpload}
      accept=".pdf,.doc,.docx,image/*"
      maxSize={maxSize}
      label={label || (isVerificationDocument ? "Upload Verification Document" : "Upload Document")}
      description={
        description ||
        (isVerificationDocument
          ? "Upload your ID or verification document (PDF, JPG, PNG)"
          : "Upload a document (PDF, DOCX, JPG, PNG)")
      }
      showPreview={true}
    />
  );
}
