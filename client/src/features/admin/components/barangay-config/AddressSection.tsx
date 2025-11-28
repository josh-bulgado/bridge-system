import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface AddressOption {
  code: string;
  name: string;
}

interface AddressSectionProps {
  regionOptions: AddressOption[];
  provinceOptions: AddressOption[];
  municipalityOptions: AddressOption[];
  barangayOptions: AddressOption[];
  selectedAddress: {
    regionCode: string;
    regionName: string;
    provinceCode: string;
    provinceName: string;
    municipalityCode: string;
    municipalityName: string;
    barangayCode: string;
    barangayName: string;
  };
  isLoadingProvinces: boolean;
  isLoadingMunicipalities: boolean;
  isLoadingBarangays: boolean;
  onAddressSelect: (
    type: "region" | "province" | "municipality" | "barangay",
    option: AddressOption,
  ) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  regionOptions,
  provinceOptions,
  municipalityOptions,
  barangayOptions,
  selectedAddress,
  isLoadingProvinces,
  isLoadingMunicipalities,
  isLoadingBarangays,
  onAddressSelect,
}) => {
  const [barangayComboOpen, setBarangayComboOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Region Selection */}
      <div className="space-y-2">
        <Label htmlFor="region">Region *</Label>
        <Select
          value={selectedAddress.regionCode}
          onValueChange={(value) => {
            const selectedRegion = regionOptions.find((r) => r.code === value);
            if (selectedRegion) {
              onAddressSelect("region", selectedRegion);
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
          value={selectedAddress.provinceCode}
          onValueChange={(value) => {
            const selectedProvince = provinceOptions.find(
              (p) => p.code === value,
            );
            if (selectedProvince) {
              onAddressSelect("province", selectedProvince);
            }
          }}
          disabled={!selectedAddress.regionCode || isLoadingProvinces}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingProvinces
                  ? "Loading provinces..."
                  : !selectedAddress.regionCode
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
            <Spinner />
            Loading provinces...
          </div>
        )}
      </div>

      {/* Municipality Selection */}
      <div className="space-y-2">
        <Label htmlFor="municipality">City/Municipality *</Label>
        <Select
          value={selectedAddress.municipalityCode}
          onValueChange={(value) => {
            const selectedMunicipality = municipalityOptions.find(
              (m) => m.code === value,
            );
            if (selectedMunicipality) {
              onAddressSelect("municipality", selectedMunicipality);
            }
          }}
          disabled={!selectedAddress.provinceCode || isLoadingMunicipalities}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingMunicipalities
                  ? "Loading municipalities..."
                  : !selectedAddress.provinceCode
                    ? "Select province first"
                    : "Select municipality"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {municipalityOptions.map((municipality) => (
              <SelectItem key={municipality.code} value={municipality.code}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingMunicipalities && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Spinner />
            Loading municipalities...
          </div>
        )}
      </div>

      {/* Barangay Selection */}
      <div className="space-y-2">
        <Label htmlFor="barangay">Barangay *</Label>
        <Popover open={barangayComboOpen} onOpenChange={setBarangayComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={barangayComboOpen}
              className="w-full justify-between"
              disabled={!selectedAddress.municipalityCode || isLoadingBarangays}
            >
              {selectedAddress.barangayCode
                ? barangayOptions.find(
                    (barangay) =>
                      barangay.code === selectedAddress.barangayCode,
                  )?.name
                : isLoadingBarangays
                  ? "Loading barangays..."
                  : !selectedAddress.municipalityCode
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
                        onAddressSelect("barangay", barangay);
                        setBarangayComboOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAddress.barangayCode === barangay.code
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
            <Spinner />
            Loading barangays...
          </div>
        )}
      </div>

      {/* Address Preview */}
      {(selectedAddress.regionName ||
        selectedAddress.provinceName ||
        selectedAddress.municipalityName ||
        selectedAddress.barangayName) && (
        <div className="mt-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
          <Label className="text-sm font-medium">
            Complete Address Preview:
          </Label>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {[
              selectedAddress.barangayName &&
                `Barangay ${selectedAddress.barangayName}`,
              selectedAddress.municipalityName,
              selectedAddress.provinceName,
              selectedAddress.regionName,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};
