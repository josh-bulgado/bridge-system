/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUploadProfilePicture, useDeleteFile } from "@/hooks/useUploadFile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
        <Avatar className="w-32 h-32">
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        <label
          htmlFor="profile-picture-input"
          className={cn(
            "absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer transition-transform hover:scale-110",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Camera className="w-4 h-4" />
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
            className="absolute top-0 right-0 p-2 bg-destructive text-destructive-foreground rounded-full transition-transform hover:scale-110"
            aria-label="Remove profile picture"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-muted-foreground">
          Click camera icon to upload
        </p>
      </div>
    </div>
  );
}
