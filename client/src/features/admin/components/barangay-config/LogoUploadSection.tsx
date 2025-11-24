import React from "react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormSetValue, FieldErrors } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface LogoUploadSectionProps {
  displayLogo: string | null;
  isUploading: boolean;
  barangayName?: string;
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: FieldErrors<BarangayConfigFormData>;
  register: any;
}

export const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({
  displayLogo,
  isUploading,
  barangayName,
  onLogoSelect,
  errors,
  register,
}) => {
  return (
    <div className="space-y-4">
      <Label>Barangay Logo *</Label>
      {/* Hidden input for form registration */}
      <input type="hidden" {...register("logoUrl")} />
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-6">
        <div className="relative">
          <Avatar className="h-32 w-32 rounded-lg">
            <AvatarImage
              src={displayLogo || undefined}
              alt="Barangay Logo"
              className="aspect-square object-cover"
            />
            <AvatarFallback className="rounded-lg text-2xl">
              {barangayName ? (
                barangayName.substring(0, 2).toUpperCase()
              ) : (
                <ImageIcon className="h-12 w-12" />
              )}
            </AvatarFallback>
          </Avatar>

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          <label
            htmlFor="logo-input"
            className={cn(
              "bg-primary text-primary-foreground absolute bottom-0 right-0 rounded-full p-2 transition-transform hover:scale-110",
              isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            <Camera className="h-4 w-4" />
            <input
              id="logo-input"
              type="file"
              accept="image/png"
              onChange={onLogoSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">Upload Logo</p>
          <p className="text-muted-foreground text-xs">
            PNG format only, max 5MB
          </p>
        </div>
      </div>
      {errors?.logoUrl && (
        <p className="text-sm text-red-500">{errors.logoUrl.message}</p>
      )}
    </div>
  );
};
