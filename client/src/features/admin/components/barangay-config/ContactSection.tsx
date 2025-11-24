import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface ContactSectionProps {
  register: UseFormRegister<BarangayConfigFormData>;
  errors?: FieldErrors<BarangayConfigFormData>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          {...register("contact.phone")}
          placeholder="+63 9XX XXX XXXX"
          className={errors?.contact?.phone ? "border-red-500" : ""}
        />
        {errors?.contact?.phone && (
          <p className="text-sm text-red-500">
            {errors.contact.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          {...register("contact.email")}
          placeholder="barangay@example.com"
          className={errors?.contact?.email ? "border-red-500" : ""}
        />
        {errors?.contact?.email && (
          <p className="text-sm text-red-500">
            {errors.contact.email.message}
          </p>
        )}
      </div>
    </div>
  );
};
