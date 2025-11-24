import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface OfficeHoursSectionProps {
  register: UseFormRegister<BarangayConfigFormData>;
  errors?: FieldErrors<BarangayConfigFormData>;
}

export const OfficeHoursSection: React.FC<OfficeHoursSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="officeHours">Office Hours *</Label>
      <Textarea
        id="officeHours"
        {...register("officeHours")}
        placeholder="Monday-Friday: 8:00 AM - 5:00 PM&#10;Saturday: 8:00 AM - 12:00 PM&#10;Sunday: Closed"
        rows={4}
        className="resize-none"
      />
      {errors?.officeHours && (
        <p className="text-sm text-red-500">{errors.officeHours.message}</p>
      )}
      <p className="text-sm text-neutral-500">
        Enter the operating hours for barangay services
      </p>
    </div>
  );
};
