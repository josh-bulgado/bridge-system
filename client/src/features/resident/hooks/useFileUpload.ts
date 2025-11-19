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
    console.log("📤 Starting file upload:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const uploadedFile = await verificationService.uploadFile(file);

      console.log("✅ Upload successful:", uploadedFile);

      setUploaded(uploadedFile);
      console.log("Updating form field with file ID:", uploadedFile.id);
      
      // Update the form field with the file ID
      fieldOnChange(uploadedFile.id);
      
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message || "Failed to upload file";
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
