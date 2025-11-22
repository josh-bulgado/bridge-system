import { useState } from "react";
import { toast } from "sonner";
import {
  verificationService,
  type UploadedFile,
} from "../services/verificationService";

export const useFileUpload = () => {
  const [uploadedIdFront, setUploadedIdFront] = useState<UploadedFile | null>(
    null,
  );
  const [uploadedIdBack, setUploadedIdBack] = useState<UploadedFile | null>(
    null,
  );
  const [uploadedProof, setUploadedProof] = useState<UploadedFile | null>(null);

  const [uploadingIdFront, setUploadingIdFront] = useState(false);
  const [uploadingIdBack, setUploadingIdBack] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);

  const handleFileUpload = async (
    file: File,
    setUploaded: (file: UploadedFile | null) => void,
    setUploading: (loading: boolean) => void,
    fieldOnChange: (id: string) => void,
  ) => {
    // Security: Don't log sensitive file information
    if (import.meta.env.DEV) {
      console.log("📤 Starting secure file upload");
    }

    // Note: File size validation is now done in verificationService.uploadFile
    // with a 20MB limit. This 5MB check is kept for backward compatibility.
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const uploadedFile = await verificationService.uploadFile(file);

      if (import.meta.env.DEV) {
        console.log("✅ Upload successful");
        // Don't log file details for security
      }

      setUploaded(uploadedFile);
      
      // Update the form field with the file ID (Cloudinary public ID)
      fieldOnChange(uploadedFile.id);
      
      toast.success("File uploaded successfully");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("❌ Upload failed");
        // Don't log full error details for security
      }

      const errorMessage =
        error.response?.data?.message || error.message || "Failed to upload file";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (
    setUploaded: (file: UploadedFile | null) => void,
    fieldOnChange: (url: string) => void,
  ) => {
    setUploaded(null);
    fieldOnChange("");
  };

  return {
    uploadedIdFront,
    uploadedIdBack,
    uploadedProof,
    uploadingIdFront,
    uploadingIdBack,
    uploadingProof,
    setUploadedIdFront,
    setUploadedIdBack,
    setUploadedProof,
    setUploadingIdFront,
    setUploadingIdBack,
    setUploadingProof,
    handleFileUpload,
    removeFile,
  };
};
