import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  MapPin,
  Phone,
  Clock,
  Save,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useSaveBarangayConfig } from "../hooks/useSaveBarangayConfig";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BarangayConfigPage: React.FC = () => {
  const {
    form,
    onSubmit,
    isLoading,
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
    isLoadingProvinces,
    isLoadingMunicipalities,
    isLoadingBarangays,
    handleAddressSelect,
  } = useSaveBarangayConfig();

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const [barangayComboOpen, setBarangayComboOpen] = React.useState(false);

  const watchedAddress = watch("address");

  return (
    <div className="mx-auto max-w-4xl px-4 lg:w-2xl lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Barangay Configuration
          </h1>
          <p className="mt-2 text-neutral-600">
            Configure basic information about your barangay
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Address Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Region Selection */}
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={watchedAddress.regionCode}
                onValueChange={(value) => {
                  const selectedRegion = regionOptions.find(
                    (r) => r.code === value,
                  );
                  if (selectedRegion) {
                    handleAddressSelect("region", selectedRegion);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Province Selection */}
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select
                value={watchedAddress.provinceCode}
                onValueChange={(value) => {
                  const selectedProvince = provinceOptions.find(
                    (p) => p.code === value,
                  );
                  if (selectedProvince) {
                    handleAddressSelect("province", selectedProvince);
                  }
                }}
                disabled={!watchedAddress.regionCode || isLoadingProvinces}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingProvinces
                        ? "Loading provinces..."
                        : !watchedAddress.regionCode
                          ? "Select region first"
                          : "Select province"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provinceOptions.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingProvinces && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading provinces...
                </div>
              )}
            </div>

            {/* Municipality Selection */}
            <div className="space-y-2">
              <Label htmlFor="municipality">City/Municipality *</Label>
              <Select
                value={watchedAddress.municipalityCode}
                onValueChange={(value) => {
                  const selectedMunicipality = municipalityOptions.find(
                    (m) => m.code === value,
                  );
                  if (selectedMunicipality) {
                    handleAddressSelect("municipality", selectedMunicipality);
                  }
                }}
                disabled={
                  !watchedAddress.provinceCode || isLoadingMunicipalities
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingMunicipalities
                        ? "Loading municipalities..."
                        : !watchedAddress.provinceCode
                          ? "Select province first"
                          : "Select municipality"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {municipalityOptions.map((municipality) => (
                    <SelectItem
                      key={municipality.code}
                      value={municipality.code}
                    >
                      {municipality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingMunicipalities && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading municipalities...
                </div>
              )}
            </div>

            {/* Barangay Selection */}
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay *</Label>
              <Popover
                open={barangayComboOpen}
                onOpenChange={setBarangayComboOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={barangayComboOpen}
                    className="w-full justify-between"
                    disabled={
                      !watchedAddress.municipalityCode || isLoadingBarangays
                    }
                  >
                    {watchedAddress.barangayCode
                      ? barangayOptions.find(
                          (barangay) =>
                            barangay.code === watchedAddress.barangayCode,
                        )?.name
                      : isLoadingBarangays
                        ? "Loading barangays..."
                        : !watchedAddress.municipalityCode
                          ? "Select municipality first"
                          : "Select barangay"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search barangays..." />
                    <CommandList>
                      <CommandEmpty>No barangay found.</CommandEmpty>
                      <CommandGroup>
                        {barangayOptions.map((barangay) => (
                          <CommandItem
                            key={barangay.code}
                            value={barangay.name}
                            onSelect={() => {
                              handleAddressSelect("barangay", barangay);
                              setBarangayComboOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watchedAddress.barangayCode === barangay.code
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {barangay.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isLoadingBarangays && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading barangays...
                </div>
              )}
            </div>

            {/* Address Preview */}
            {(watchedAddress.regionName ||
              watchedAddress.provinceName ||
              watchedAddress.municipalityName ||
              watchedAddress.barangayName) && (
              <div className="mt-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
                <Label className="text-sm font-medium">
                  Complete Address Preview:
                </Label>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  {[
                    watchedAddress.barangayName &&
                      `Barangay ${watchedAddress.barangayName}`,
                    watchedAddress.municipalityName,
                    watchedAddress.provinceName,
                    watchedAddress.regionName,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("contact.phone", {
                    required: "Phone number is required",
                  })}
                  placeholder="+63 2 1234 5678"
                  className={errors.contact?.phone ? "border-red-500" : ""}
                />
                {errors.contact?.phone && (
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
                  {...register("contact.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="barangay@example.com"
                  className={errors.contact?.email ? "border-red-500" : ""}
                />
                {errors.contact?.email && (
                  <p className="text-sm text-red-500">
                    {errors.contact.email.message}
                  </p>
                )}
              </div>
            </div>
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officeHours">Office Hours</Label>
              <Textarea
                id="officeHours"
                {...register("officeHours")}
                placeholder="Monday-Friday: 8:00 AM - 5:00 PM&#10;Saturday: 8:00 AM - 12:00 PM&#10;Sunday: Closed"
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-neutral-500">
                Enter the operating hours for barangay services
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[150px]"
            size="lg"
          >
            {isLoading ? (
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
    </div>
  );
};

export default BarangayConfigPage;
