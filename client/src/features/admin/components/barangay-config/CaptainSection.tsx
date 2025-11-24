import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface CaptainSectionProps {
  register: UseFormRegister<BarangayConfigFormData>;
  errors?: FieldErrors<BarangayConfigFormData>;
  captainName?: string;
  barangayName?: string;
  displayLogo?: string | null;
}

export const CaptainSection: React.FC<CaptainSectionProps> = ({
  register,
  errors,
  captainName,
  barangayName,
  displayLogo,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="barangayCaptain" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Barangay Captain *
        </Label>
        <Input
          id="barangayCaptain"
          {...register("barangayCaptain")}
          placeholder="Enter captain's full name"
          className={errors?.barangayCaptain ? "border-red-500" : ""}
        />
        {errors?.barangayCaptain && (
          <p className="text-sm text-red-500">
            {errors.barangayCaptain.message}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          Full name of the current Barangay Captain
        </p>
      </div>

      {/* Preview Section */}
      {barangayName && (
        <div className="bg-muted/50 mt-6 rounded-lg border p-4">
          <Label className="text-sm font-medium">Preview:</Label>
          <div className="mt-2 flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage
                src={displayLogo || undefined}
                alt="Logo preview"
                className="aspect-square object-cover"
              />
              <AvatarFallback className="rounded-lg text-xs">
                {barangayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Barangay {barangayName}</p>
              <p className="text-muted-foreground text-xs">
                {captainName || "Captain name"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
