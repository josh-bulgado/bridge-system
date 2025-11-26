import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Upload, X, Loader2, InfoIcon } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";
import { useUploadBarangayLogo } from "../../hooks/useUploadBarangayLogo";

interface GCashSectionProps {
  register: UseFormRegister<BarangayConfigFormData>;
  errors: FieldErrors<BarangayConfigFormData>;
  displayQrCode: string | null;
  onQrCodeSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQrCodeRemove: () => void;
  isUploadingQr: boolean;
}

export const GCashSection: React.FC<GCashSectionProps> = ({
  register,
  errors,
  displayQrCode,
  onQrCodeSelect,
  onQrCodeRemove,
  isUploadingQr,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* QR Code Upload */}
        <div className="space-y-3">
          <Label htmlFor="gcash-qr-upload" className="text-sm font-medium">
            GCash QR Code
          </Label>
          
          <div className="flex flex-col items-center gap-4">
            {/* QR Code Preview */}
            <div className="relative w-full max-w-[200px]">
              {displayQrCode ? (
                <div className="relative rounded-lg border-2 border-primary/20 p-3 bg-white">
                  <img
                    src={displayQrCode}
                    alt="GCash QR Code Preview"
                    className="w-full h-auto object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={onQrCodeRemove}
                    disabled={isUploadingQr}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-center">
                    <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No QR code uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="w-full">
              <input
                type="file"
                id="gcash-qr-upload"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/bmp"
                onChange={onQrCodeSelect}
                className="hidden"
                disabled={isUploadingQr}
              />
              <label
                htmlFor="gcash-qr-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  isUploadingQr
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer"
                }`}
              >
                {isUploadingQr ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {displayQrCode ? "Change QR Code" : "Upload QR Code"}
                  </>
                )}
              </label>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                PNG, JPEG, JPG, GIF, WEBP, BMP
              </p>
            </div>

            <input type="hidden" {...register("gcashQrCodeUrl")} />
            {errors.gcashQrCodeUrl && (
              <p className="text-sm text-red-500">{errors.gcashQrCodeUrl.message}</p>
            )}
          </div>
        </div>

        {/* GCash Account Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gcashNumber" className="text-sm font-medium">
              GCash Number
            </Label>
            <Input
              id="gcashNumber"
              type="text"
              placeholder="e.g., 0917-123-4567"
              {...register("gcashNumber")}
              className={errors.gcashNumber ? "border-red-500" : ""}
            />
            {errors.gcashNumber && (
              <p className="text-sm text-red-500">{errors.gcashNumber.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: 09XXXXXXXXX or +639XXXXXXXXX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gcashAccountName" className="text-sm font-medium">
              Account Name
            </Label>
            <Input
              id="gcashAccountName"
              type="text"
              placeholder="e.g., Barangay Hall"
              {...register("gcashAccountName")}
              className={errors.gcashAccountName ? "border-red-500" : ""}
            />
            {errors.gcashAccountName && (
              <p className="text-sm text-red-500">{errors.gcashAccountName.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Name registered to the GCash account
            </p>
          </div>

          <Alert className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Tip:</strong> Generate a GCash QR code from your GCash app (Profile → My QR → Save) and upload it here. Residents will scan this to pay for documents.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};
