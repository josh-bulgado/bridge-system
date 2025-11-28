/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUploadProfilePicture, useDeleteFile } from "@/hooks/useUploadFile";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

/**
 * Profile Picture Upload with Validation
 * - File type and size validation
 * - Secure error handling
 */

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  currentPublicId?: string;
  onUploadSuccess?: (url: string, publicId: string) => void;
  onDeleteSuccess?: () => void;
  userName?: string;
  className?: string;
}

export function ProfilePictureUpload({
  currentImageUrl,
  currentPublicId,
  onUploadSuccess,
  onDeleteSuccess,
  userName = "User",
  className,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const uploadMutation = useUploadProfilePicture();
  const deleteMutation = useDeleteFile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPG, PNG, WEBP)",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image must be less than 5MB",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      const result = await uploadMutation.mutateAsync(file);

      toast.success("Profile picture updated", {
        description: "Your profile picture has been updated successfully.",
      });

      if (onUploadSuccess) {
        onUploadSuccess(result.url, result.publicId);
      }

      setPreview(null);
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload profile picture",
      });
      setPreview(null);
    }
  };

  const handleDelete = async () => {
    if (!currentPublicId) return;

    try {
      await deleteMutation.mutateAsync({
        publicId: currentPublicId,
        isDocument: false,
      });

      toast.success("Profile picture removed", {
        description: "Your profile picture has been removed.",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error.message || "Failed to delete profile picture",
      });
    }
  };

  const displayImage = preview || currentImageUrl;
  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={displayImage || undefined} alt={userName} />
          <AvatarFallback className="text-2xl">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Spinner />
          </div>
        )}

        <label
          htmlFor="profile-picture-input"
          className={cn(
            "bg-primary text-primary-foreground absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-transform hover:scale-110",
            isLoading && "cursor-not-allowed opacity-50",
          )}
        >
          <Camera className="h-4 w-4" />
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />
        </label>

        {currentImageUrl && !isLoading && (
          <button
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground absolute top-0 right-0 rounded-full p-2 transition-transform hover:scale-110"
            aria-label="Remove profile picture"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-muted-foreground text-xs">
          Click camera icon to upload
        </p>
      </div>
    </div>
  );
}
