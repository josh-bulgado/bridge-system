import { useState } from "react";
import { regions, provinces, cities, barangays } from "select-philippines-address";
import { toast } from "sonner";

export const useAddressSelect = (form) => {
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState({
    regions: false,
    provinces: false,
    municipalities: false,
    barangays: false,
  });

  const selectedRegion = form.watch("address.regionCode");
  const selectedProvince = form.watch("address.provinceCode");
  const selectedMunicipality = form.watch("address.municipalityCode");

  // Function to load regions
  const loadRegions = async () => {
    setIsLoading((prev) => ({ ...prev, regions: true }));
    try {
      const regionData = await regions();
      setRegionOptions(regionData.map((region) => ({
        code: region.region_code,
        name: region.region_name,
      })));
    } catch (error) {
      toast.error("Failed to load regions");
    } finally {
      setIsLoading((prev) => ({ ...prev, regions: false }));
    }
  };

  // Function to load provinces based on region
  const loadProvinces = async (regionCode) => {
    setIsLoading((prev) => ({ ...prev, provinces: true }));
    try {
      const provinceData = await provinces(regionCode);
      setProvinceOptions(provinceData.map((province) => ({
        code: province.province_code,
        name: province.province_name,
      })));
      // Reset dependent fields
      form.setValue("address.provinceCode", "");
      form.setValue("address.municipalityCode", "");
      form.setValue("address.barangayCode", "");
      setMunicipalityOptions([]);
      setBarangayOptions([]);
    } catch (error) {
      toast.error("Failed to load provinces");
    } finally {
      setIsLoading((prev) => ({ ...prev, provinces: false }));
    }
  };

  // Function to load municipalities based on province
  const loadMunicipalities = async (provinceCode) => {
    setIsLoading((prev) => ({ ...prev, municipalities: true }));
    try {
      const municipalityData = await cities(provinceCode);
      setMunicipalityOptions(municipalityData.map((municipality) => ({
        code: municipality.city_code,
        name: municipality.city_name,
      })));
      // Reset dependent fields
      form.setValue("address.municipalityCode", "");
      form.setValue("address.barangayCode", "");
      setBarangayOptions([]);
    } catch (error) {
      toast.error("Failed to load municipalities");
    } finally {
      setIsLoading((prev) => ({ ...prev, municipalities: false }));
    }
  };

  // Function to load barangays based on municipality
  const loadBarangays = async (municipalityCode) => {
    setIsLoading((prev) => ({ ...prev, barangays: true }));
    try {
      const barangayData = await barangays(municipalityCode);
      setBarangayOptions(barangayData.map((barangay) => ({
        code: barangay.brgy_code,
        name: barangay.brgy_name,
      })));
      form.setValue("address.barangayCode", "");
    } catch (error) {
      toast.error("Failed to load barangays");
    } finally {
      setIsLoading((prev) => ({ ...prev, barangays: false }));
    }
  };

  // Event handler for region change
  const handleRegionChange = async (event) => {
    const regionCode = event.target.value;
    form.setValue("address.regionCode", regionCode);
    loadProvinces(regionCode);
  };

  // Event handler for province change
  const handleProvinceChange = async (event) => {
    const provinceCode = event.target.value;
    form.setValue("address.provinceCode", provinceCode);
    loadMunicipalities(provinceCode);
  };

  // Event handler for municipality change
  const handleMunicipalityChange = async (event) => {
    const municipalityCode = event.target.value;
    form.setValue("address.municipalityCode", municipalityCode);
    loadBarangays(municipalityCode);
  };

  // Load regions when component is mounted (initial load)
  const loadInitialData = async () => {
    loadRegions();
  };

  // Call loadInitialData when component mounts
  useState(() => {
    loadInitialData();
  }, []);

  return {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
    isLoading,
    handleRegionChange,
    handleProvinceChange,
    handleMunicipalityChange,
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
  };
};
