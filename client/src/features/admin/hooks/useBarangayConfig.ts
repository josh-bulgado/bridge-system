import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { toast } from "sonner";
import {
  barangayConfigSchema,
  type BarangayConfigFormData,
} from "../schemas/barangayConfigSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { barangayConfigService } from "../services/configService";

export interface AddressOption {
  code: string;
  name: string;
}

export const useBarangayConfig = () => {
  // Form management
  const form = useForm<BarangayConfigFormData>({
    resolver: zodResolver(barangayConfigSchema),
    defaultValues: {
      address: {
        regionCode: "",
        regionName: "",
        provinceCode: "",
        provinceName: "",
        municipalityCode: "",
        municipalityName: "",
        barangayCode: "",
        barangayName: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      officeHours: "",
    },
  });

  // Address options state
  const [regionOptions, setRegionOptions] = useState<AddressOption[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<
    AddressOption[]
  >([]);
  const [barangayOptions, setBarangayOptions] = useState<AddressOption[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Watch for address changes to trigger cascading dropdowns
  const selectedRegion = form.watch("address.regionCode");
  const selectedProvince = form.watch("address.provinceCode");
  const selectedMunicipality = form.watch("address.municipalityCode");

  // Handle address selection
  const handleAddressSelect = (
    type: "region" | "province" | "municipality" | "barangay",
    option: AddressOption,
  ) => {
    switch (type) {
      case "region":
        form.setValue("address.regionCode", option.code);
        form.setValue("address.regionName", option.name);
        break;
      case "province":
        form.setValue("address.provinceCode", option.code);
        form.setValue("address.provinceName", option.name);
        break;
      case "municipality":
        form.setValue("address.municipalityCode", option.code);
        form.setValue("address.municipalityName", option.name);
        break;
      case "barangay":
        form.setValue("address.barangayCode", option.code);
        form.setValue("address.barangayName", option.name);
        break;
    }
  };

  // Load existing configuration and regions on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load regions first
        const regionData = await regions();
        setRegionOptions(
          regionData.map((region: any) => ({
            code: region.region_code,
            name: region.region_name,
          })),
        );

        // Load existing configuration if it exists
        const existingConfig = await barangayConfigService.getBarangayConfig();
        if (existingConfig) {
          // Set form values
          form.reset(existingConfig);

          // Load dependent address options based on existing values
          if (existingConfig.address.regionCode) {
            const provinceData = await provinces(existingConfig.address.regionCode);
            setProvinceOptions(
              provinceData.map((province: any) => ({
                code: province.province_code,
                name: province.province_name,
              })),
            );

            if (existingConfig.address.provinceCode) {
              const municipalityData = await cities(existingConfig.address.provinceCode);
              setMunicipalityOptions(
                municipalityData.map((municipality: any) => ({
                  code: municipality.city_code,
                  name: municipality.city_name,
                })),
              );

              if (existingConfig.address.municipalityCode) {
                const barangayData = await barangays(existingConfig.address.municipalityCode);
                setBarangayOptions(
                  barangayData.map((barangay: any) => ({
                    code: barangay.brgy_code,
                    name: barangay.brgy_name,
                  })),
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoadingConfig(false);
      }
    };

    initializeData();
  }, [form]);

  // Load provinces when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setProvinceOptions([]);
      return;
    }

    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provinceData = await provinces(selectedRegion);
        setProvinceOptions(
          provinceData.map((province: any) => ({
            code: province.province_code,
            name: province.province_name,
          })),
        );

        // Clear dependent fields
        form.setValue("address.provinceCode", "");
        form.setValue("address.provinceName", "");
        form.setValue("address.municipalityCode", "");
        form.setValue("address.municipalityName", "");
        form.setValue("address.barangayCode", "");
        form.setValue("address.barangayName", "");
        setMunicipalityOptions([]);
        setBarangayOptions([]);
      } catch (error) {
        console.error("Error loading provinces:", error);
        toast.error("Failed to load provinces");
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [selectedRegion, form]);

  // Load municipalities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setMunicipalityOptions([]);
      return;
    }

    const loadMunicipalities = async () => {
      setIsLoadingMunicipalities(true);
      try {
        const municipalityData = await cities(selectedProvince);
        setMunicipalityOptions(
          municipalityData.map((municipality: any) => ({
            code: municipality.city_code,
            name: municipality.city_name,
          })),
        );

        // Clear dependent fields
        form.setValue("address.municipalityCode", "");
        form.setValue("address.municipalityName", "");
        form.setValue("address.barangayCode", "");
        form.setValue("address.barangayName", "");
        setBarangayOptions([]);
      } catch (error) {
        console.error("Error loading municipalities:", error);
        toast.error("Failed to load municipalities");
      } finally {
        setIsLoadingMunicipalities(false);
      }
    };

    loadMunicipalities();
  }, [selectedProvince, form]);

  // Load barangays when municipality changes
  useEffect(() => {
    if (!selectedMunicipality) {
      setBarangayOptions([]);
      return;
    }

    const loadBarangays = async () => {
      setIsLoadingBarangays(true);
      try {
        const barangayData = await barangays(selectedMunicipality);
        setBarangayOptions(
          barangayData.map((barangay: any) => ({
            code: barangay.brgy_code,
            name: barangay.brgy_name,
          })),
        );

        // Clear dependent field
        form.setValue("address.barangayName", "");
        form.setValue("address.barangayCode", "");
      } catch (error) {
        console.error("Error loading barangays:", error);
        toast.error("Failed to load barangays");
      } finally {
        setIsLoadingBarangays(false);
      }
    };

    loadBarangays();
  }, [selectedMunicipality, form]);

  // Save configuration
  const onSubmit = async (data: BarangayConfigFormData) => {
    setIsLoading(true);
    try {
      await barangayConfigService.saveBarangayConfig(data);
      toast.success("Barangay configuration saved successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save configuration";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,

    // Address options
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,

    // Loading states
    isLoadingConfig,
    isLoadingProvinces,
    isLoadingMunicipalities,
    isLoadingBarangays,

    // Helper functions
    handleAddressSelect,
  };
};
