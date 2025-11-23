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
    urlFieldOnChange?: (url: string) => void,
    fileTypeFieldOnChange?: (fileType: string) => void,
  ) => {
    // 🔒 Security: Don't log sensitive file information
    if (import.meta.env.DEV) {
      console.log("📤 Starting secure file upload");
    }

    setUploading(true);
    try {
      // All validation is now handled in verificationService.uploadFile
      const uploadedFile = await verificationService.uploadFile(file);

      if (import.meta.env.DEV) {
        console.log("✅ Upload successful");
      }

      setUploaded(uploadedFile);
      
      // Update the form field with the file ID (Cloudinary public ID)
      fieldOnChange(uploadedFile.id);
      
      // Update the URL field if callback is provided
      if (urlFieldOnChange) {
        urlFieldOnChange(uploadedFile.url);
      }
      
      // Update the file type field if callback is provided
      if (fileTypeFieldOnChange) {
        fileTypeFieldOnChange(uploadedFile.fileType);
      }
      
      toast.success("File uploaded successfully");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("❌ Upload failed:", error.message);
      }

      // Error message is already user-friendly from verificationService
      const errorMessage = error.message || "Failed to upload file";
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
