import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";

interface AddressFormProps {
  form: any;
}

interface AddressOption {
  code: string;
  name: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ form }) => {
  // State for options
  const [regionOptions, setRegionOptions] = useState<AddressOption>([]);
  const [provinceOptions, setProvinceOptions] = useState<AddressOption>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<AddressOption>(
    [],
  );
  const [barangayOptions, setBarangayOptions] = useState<AddressOption>([]);

  const [barangayComboOpen, setBarangayComboOpen] = useState(false);

  // Watch for address changes to trigger cascading dropdowns
  const selectedRegion = form.watch("address.regionCode");
  const selectedProvince = form.watch("address.provinceCode");
  const selectedMunicipality = form.watch("address.municipalityCode");

  const { register, watch } = form;

  // Load regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      const regionData = await regions();
      setRegionOptions(
        regionData.map((region: any) => ({
          code: region.region_code,
          name: region.region_name,
        })),
      );
    };

    fetchRegions();
  }, []);

  // Load provinces when region changes
  useEffect(() => {
    if (!watch.regionCode) {
      setProvinceOptions([]);
      return;
    }

    const fetchProvinces = async () => {
      const provinceData = await provinces(watch.region_code);
      setProvinceOptions(
        provinceData.map((province: any) => ({
          code: province.province_code,
          name: province.province_name,
        })),
      );
    };

    fetchProvinces();
  }, [watch.regionCode]);

  // Load municipalities when province changes
  useEffect(() => {
    if (!watch.provinceCode) {
      setMunicipalityOptions([]);
      return;
    }

    const fetchMunicipalities = async () => {
      const municipalityData = await cities(watch.provinceCode);
      setMunicipalityOptions(
        municipalityData.map((municipality: any) => ({
          code: municipality.city_code,
          name: municipality.city_name,
        })),
      );
    };

    fetchMunicipalities();
  }, [watch.provinceCode]);

  // Load barangays when municipality changes
  useEffect(() => {
    if (!watch.municipalityCode) {
      setBarangayOptions([]);
      return;
    }

    const fetchBarangays = async () => {
      const barangayData = await barangays(watch.municipalityCode);
      setBarangayOptions(
        barangayData.map((barangay: any) => ({
          code: barangay.brgy_code,
          name: barangay.brgy_name,
        })),
      );
    };

    fetchBarangays();
  }, [watch.municipalityCode]);

  return (
    <div className="space-y-4">
      {/* Region Selection */}
      <div>
        <Label>Region</Label>
        <Select
          value={watch.regionCode}
          onValueChange={(value) => {
            const selectedRegion = regionOptions.find(
              (region) => region.code === value,
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
      <div>
        <Label>Province</Label>
        <Select
          value={watch.provinceCode}
          onValueChange={(value) => {
            const selectedProvince = provinceOptions.find(
              (province) => province.code === value,
            );
            if (selectedProvince) {
              handleAddressSelect("province", selectedProvince);
            }
          }}
          disabled={!watch.regionCode}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={"Select province"} />
          </SelectTrigger>
          <SelectContent>
            {provinceOptions.map((province) => (
              <SelectItem key={province.code} value={province.code}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Municipality Selection */}
      <div>
        <Label>Municipality</Label>
        <Select
          value={watch.municipalityCode}
          onValueChange={(value) => {
            const selectedMunicipality = municipalityOptions.find(
              (municipality) => municipality.code === value,
            );
            if (selectedMunicipality) {
              handleAddressSelect("municipality", selectedMunicipality);
            }
          }}
          disabled={!watch.provinceCode}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={"Select municipality"} />
          </SelectTrigger>
          <SelectContent>
            {municipalityOptions.map((municipality) => (
              <SelectItem key={municipality.code} value={municipality.code}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Barangay Selection */}
      <div>
        <Label>Barangay</Label>
        <Popover open={barangayComboOpen} onOpenChange={setBarangayComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={barangayComboOpen}
              className="w-full justify-between"
              disabled={!watch.municipalityCode}
            >
              {watch.barangayCode
                ? barangayOptions.find(
                    (barangay) => barangay.code === watch.barangayCode,
                  )?.name
                : !watch.municipalityCode
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
                        className="mr-2 h-4 w-4"
                        style={{
                          opacity: watch.barangayCode === barangay.code ? 1 : 0,
                        }}
                      />
                      {barangay.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Address Preview */}
      {(watch.regionName ||
        watch.provinceName ||
        watch.municipalityName ||
        watch.barangayName) && (
        <div className="mt-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
          <Label className="text-sm font-medium">
            Complete Address Preview:
          </Label>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {[
              watch.barangayName && `Barangay ${watch.barangayName}`,
              watch.municipalityName,
              watch.provinceName,
              watch.regionName,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
