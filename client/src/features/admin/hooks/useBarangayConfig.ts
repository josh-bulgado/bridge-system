import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { toast } from "sonner";

export interface BarangayConfigData {
  name: string;
  address: {
    region: string;
    regionCode: string;
    province: string;
    provinceCode: string;
    municipality: string;
    municipalityCode: string;
    barangay: string;
    barangayCode: string;
    street: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  officeHours: string;
}

export interface AddressOption {
  code: string;
  name: string;
}

export const useBarangayConfig = () => {
  // Form management
  const form = useForm<BarangayConfigData>({
    defaultValues: {
      name: "",
      address: {
        region: "",
        regionCode: "",
        province: "",
        provinceCode: "",
        municipality: "",
        municipalityCode: "",
        barangay: "",
        barangayCode: "",
        street: "",
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
        form.setValue("address.region", option.name);
        form.setValue("address.regionCode", option.code);
        break;
      case "province":
        form.setValue("address.province", option.name);
        form.setValue("address.provinceCode", option.code);
        break;
      case "municipality":
        form.setValue("address.municipality", option.name);
        form.setValue("address.municipalityCode", option.code);
        break;
      case "barangay":
        form.setValue("address.barangay", option.name);
        form.setValue("address.barangayCode", option.code);
        break;
    }
  };

  // Load regions on component mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = await regions();
        setRegionOptions(
          regionData.map((region: any) => ({
            code: region.region_code,
            name: region.region_name,
          })),
        );
      } catch (error) {
        console.error("Error loading regions:", error);
        toast.error("Failed to load regions");
      }
    };

    loadRegions(); // Load mock data for demonstration
  }, []);

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
        form.setValue("address.province", "");
        form.setValue("address.provinceCode", "");
        form.setValue("address.municipality", "");
        form.setValue("address.municipalityCode", "");
        form.setValue("address.barangay", "");
        form.setValue("address.barangayCode", "");
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
        form.setValue("address.municipality", "");
        form.setValue("address.municipalityCode", "");
        form.setValue("address.barangay", "");
        form.setValue("address.barangayCode", "");
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
        form.setValue("address.barangay", "");
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
  const onSubmit = async (data: BarangayConfigData) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving barangay config:", data);
      toast.success("Barangay configuration saved successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
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
    isLoadingProvinces,
    isLoadingMunicipalities,
    isLoadingBarangays,

    // Helper functions
    handleAddressSelect,
  };
};
