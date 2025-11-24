import { useState } from "react";
import { toast } from "sonner";
import { useUploadProfilePicture } from "@/hooks/useUploadFile";

export interface UploadedLogo {
  url: string;
  publicId: string;
}

/**
 * Hook to handle barangay logo upload
 */
export const useUploadBarangayLogo = () => {
  const [uploadedLogo, setUploadedLogo] = useState<UploadedLogo | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const uploadMutation = useUploadProfilePicture();

  const handleLogoUpload = async (
    file: File,
    onSuccess: (url: string, publicId: string) => void
  ) => {
    // Validate file type - only PNG
    if (file.type !== "image/png") {
      toast.error("Invalid file type", {
        description: "Please select a PNG image file",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Logo must be less than 5MB",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      const result = await uploadMutation.mutateAsync(file);

      toast.success("Logo uploaded", {
        description: "Barangay logo has been uploaded successfully.",
      });

      setUploadedLogo({
        url: result.url,
        publicId: result.publicId,
      });
      setLogoPreview(null);
      
      // Call success callback
      onSuccess(result.url, result.publicId);
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload logo",
      });
      setLogoPreview(null);
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setLogoPreview(null);
  };

  return {
    uploadedLogo,
    logoPreview,
    isUploading: uploadMutation.isPending,
    handleLogoUpload,
    removeLogo,
  };
};
