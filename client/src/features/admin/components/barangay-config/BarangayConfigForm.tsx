import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Phone, Clock, Save, Loader2, Wallet } from "lucide-react";
import { LogoUploadSection } from "./LogoUploadSection";
import { CaptainSection } from "./CaptainSection";
import { AddressSection } from "./AddressSection";
import { ContactSection } from "./ContactSection";
import { OfficeHoursSection } from "./OfficeHoursSection";
import { GCashSection } from "./GCashSection";
import type { UseFormReturn } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface AddressOption {
  code: string;
  name: string;
}

interface BarangayConfigFormProps {
  form: UseFormReturn<BarangayConfigFormData>;
  onSubmit: (data: BarangayConfigFormData) => void;
  displayLogo: string | null;
  isUploading: boolean;
  isSaving: boolean;
  hasExistingConfig: boolean;
  regionOptions: AddressOption[];
  provinceOptions: AddressOption[];
  municipalityOptions: AddressOption[];
  barangayOptions: AddressOption[];
  isLoadingProvinces: boolean;
  isLoadingMunicipalities: boolean;
  isLoadingBarangays: boolean;
  onAddressSelect: (
    type: "region" | "province" | "municipality" | "barangay",
    option: AddressOption
  ) => void;
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayQrCode?: string | null;
  isUploadingQr: boolean;
  onQrCodeSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQrCodeRemove: () => void;
  onCancel?: () => void;
}

export const BarangayConfigForm: React.FC<BarangayConfigFormProps> = ({
  form,
  onSubmit,
  displayLogo,
  isUploading,
  isSaving,
  hasExistingConfig,
  regionOptions,
  provinceOptions,
  municipalityOptions,
  barangayOptions,
  isLoadingProvinces,
  isLoadingMunicipalities,
  isLoadingBarangays,
  onAddressSelect,
  onLogoSelect,
  displayQrCode,
  isUploadingQr,
  onQrCodeSelect,
  onQrCodeRemove,
  onCancel,
}) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = form;

  const watchedAddress = watch("address");
  const watchedBarangayName = watch("address.barangayName");
  const watchedCaptain = watch("barangayCaptain");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Card - Logo and Captain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Upload barangay logo and enter captain details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LogoUploadSection
              displayLogo={displayLogo}
              isUploading={isUploading}
              barangayName={watchedBarangayName}
              onLogoSelect={onLogoSelect}
              errors={errors}
              register={register}
            />
            <CaptainSection
              register={register}
              errors={errors}
              captainName={watchedCaptain}
              barangayName={watchedBarangayName}
              displayLogo={displayLogo}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Address Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddressSection
            regionOptions={regionOptions}
            provinceOptions={provinceOptions}
            municipalityOptions={municipalityOptions}
            barangayOptions={barangayOptions}
            selectedAddress={watchedAddress}
            isLoadingProvinces={isLoadingProvinces}
            isLoadingMunicipalities={isLoadingMunicipalities}
            isLoadingBarangays={isLoadingBarangays}
            onAddressSelect={onAddressSelect}
          />
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactSection register={register} errors={errors} />
        </CardContent>
      </Card>

      {/* Office Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Office Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OfficeHoursSection register={register} errors={errors} />
        </CardContent>
      </Card>

      {/* GCash Payment Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            GCash Payment Configuration
          </CardTitle>
          <CardDescription>
            Leave blank if you only accept face-to-face payments at the barangay hall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GCashSection
            register={register}
            errors={errors}
            displayQrCode={displayQrCode}
            onQrCodeSelect={onQrCodeSelect}
            onQrCodeRemove={onQrCodeRemove}
            isUploadingQr={isUploadingQr}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {hasExistingConfig && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            size="lg"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className="min-w-[150px]"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
