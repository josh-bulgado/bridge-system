/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";

import {
  barangayConfigSchema,
  type BarangayConfigFormData,
} from "../schemas/barangayConfigSchema";
import {
  useFetchBarangayConfig,
  useSaveBarangayConfig,
  useUploadBarangayLogo,
} from "../hooks";
import { BarangayConfigView, BarangayConfigForm } from "../components/barangay-config";
import { cleanBarangayName } from "../utils/barangayNameFormatter";

interface AddressOption {
  code: string;
  name: string;
}

const BarangayConfigPage: React.FC = () => {
  // View/Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Hooks
  const { data: existingConfig, isLoading: isLoadingConfig } = useFetchBarangayConfig();
  const saveMutation = useSaveBarangayConfig();
  const { logoPreview, isUploading, handleLogoUpload } = useUploadBarangayLogo();

  // Form
  const form = useForm<BarangayConfigFormData>({
    resolver: zodResolver(barangayConfigSchema),
    defaultValues: {
      barangayCaptain: "",
      logoUrl: "",
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

  const { setValue, watch, reset, trigger } = form;

  // Address options state
  const [regionOptions, setRegionOptions] = useState<AddressOption[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<AddressOption[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<AddressOption[]>([]);

  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);

  // Watch form values
  const watchedAddress = watch("address");
  const watchedLogoUrl = watch("logoUrl");

  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      const regionData = await regions();
      setRegionOptions(
        regionData.map((region: any) => ({
          code: region.region_code,
          name: region.region_name,
        }))
      );
    };
    loadRegions();
  }, []);

  // Determine initial mode based on existing config
  useEffect(() => {
    if (existingConfig) {
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  }, [existingConfig]);

  // Load existing config
  useEffect(() => {
    if (existingConfig) {
      reset(existingConfig);

      // Load address dropdowns based on existing data
      const loadExistingAddressOptions = async () => {
        if (existingConfig.address.regionCode) {
          const provinceData = await provinces(existingConfig.address.regionCode);
          setProvinceOptions(
            provinceData.map((province: any) => ({
              code: province.province_code,
              name: province.province_name,
            }))
          );

          if (existingConfig.address.provinceCode) {
            const municipalityData = await cities(existingConfig.address.provinceCode);
            setMunicipalityOptions(
              municipalityData.map((municipality: any) => ({
                code: municipality.city_code,
                name: municipality.city_name,
              }))
            );

            if (existingConfig.address.municipalityCode) {
              const barangayData = await barangays(existingConfig.address.municipalityCode);
              setBarangayOptions(
                barangayData.map((barangay: any) => ({
                  code: barangay.brgy_code,
                  name: barangay.brgy_name,
                }))
              );
            }
          }
        }
      };
      loadExistingAddressOptions();
    }
  }, [existingConfig, reset]);

  // Load provinces when region changes
  useEffect(() => {
    if (!watchedAddress.regionCode) {
      setProvinceOptions([]);
      return;
    }

    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provinceData = await provinces(watchedAddress.regionCode);
        setProvinceOptions(
          provinceData.map((province: any) => ({
            code: province.province_code,
            name: province.province_name,
          }))
        );
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, [watchedAddress.regionCode]);

  // Load municipalities when province changes
  useEffect(() => {
    if (!watchedAddress.provinceCode) {
      setMunicipalityOptions([]);
      return;
    }

    const loadMunicipalities = async () => {
      setIsLoadingMunicipalities(true);
      try {
        const municipalityData = await cities(watchedAddress.provinceCode);
        setMunicipalityOptions(
          municipalityData.map((municipality: any) => ({
            code: municipality.city_code,
            name: municipality.city_name,
          }))
        );
      } finally {
        setIsLoadingMunicipalities(false);
      }
    };
    loadMunicipalities();
  }, [watchedAddress.provinceCode]);

  // Load barangays when municipality changes
  useEffect(() => {
    if (!watchedAddress.municipalityCode) {
      setBarangayOptions([]);
      return;
    }

    const loadBarangays = async () => {
      setIsLoadingBarangays(true);
      try {
        const barangayData = await barangays(watchedAddress.municipalityCode);
        setBarangayOptions(
          barangayData.map((barangay: any) => ({
            code: barangay.brgy_code,
            name: barangay.brgy_name,
          }))
        );
      } finally {
        setIsLoadingBarangays(false);
      }
    };
    loadBarangays();
  }, [watchedAddress.municipalityCode]);

  // Handle address selection
  const handleAddressSelect = (
    type: "region" | "province" | "municipality" | "barangay",
    option: AddressOption
  ) => {
    switch (type) {
      case "region":
        setValue("address.regionCode", option.code);
        setValue("address.regionName", option.name);
        setValue("address.provinceCode", "");
        setValue("address.provinceName", "");
        setValue("address.municipalityCode", "");
        setValue("address.municipalityName", "");
        setValue("address.barangayCode", "");
        setValue("address.barangayName", "");
        break;
      case "province":
        setValue("address.provinceCode", option.code);
        setValue("address.provinceName", option.name);
        setValue("address.municipalityCode", "");
        setValue("address.municipalityName", "");
        setValue("address.barangayCode", "");
        setValue("address.barangayName", "");
        break;
      case "municipality":
        setValue("address.municipalityCode", option.code);
        setValue("address.municipalityName", option.name);
        setValue("address.barangayCode", "");
        setValue("address.barangayName", "");
        break;
      case "barangay":
        setValue("address.barangayCode", option.code);
        setValue("address.barangayName", option.name);
        break;
    }
  };

  // Handle logo file selection
  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleLogoUpload(file, async (url) => {
      setValue("logoUrl", url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      await trigger("logoUrl");
    });

    e.target.value = "";
  };

  // Handle form submission
  const onSubmit = async (data: BarangayConfigFormData) => {
    // Clean the barangay name before saving (remove Bgy, Brgy, Barangay prefixes)
    const cleanedData = {
      ...data,
      address: {
        ...data.address,
        barangayName: cleanBarangayName(data.address.barangayName),
      },
    };
    
    await saveMutation.mutateAsync(cleanedData);
    setIsEditMode(false);
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle cancel button click
  const handleCancelEdit = () => {
    if (existingConfig) {
      reset(existingConfig);
      setIsEditMode(false);
    }
  };

  const displayLogo = logoPreview || watchedLogoUrl;

  if (isLoadingConfig) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Barangay Configuration
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Loading configuration...
          </p>
        </div>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
            <p className="text-muted-foreground mt-4 text-sm">
              Fetching barangay configuration...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container  max-w-7xl ">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Barangay Configuration
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {isEditMode
              ? "Configure basic information about your barangay"
              : "View and manage your barangay configuration"}
          </p>
        </div>
        {!isEditMode && existingConfig && (
          <Button onClick={handleEditClick} size="lg">
            Edit Configuration
          </Button>
        )}
      </div>

      {/* VIEW MODE - Preview */}
      {!isEditMode && existingConfig && (
        <BarangayConfigView config={existingConfig} />
      )}

      {/* EDIT MODE - Form */}
      {isEditMode && (
        <BarangayConfigForm
          form={form}
          onSubmit={onSubmit}
          displayLogo={displayLogo}
          isUploading={isUploading}
          isSaving={saveMutation.isPending}
          hasExistingConfig={!!existingConfig}
          regionOptions={regionOptions}
          provinceOptions={provinceOptions}
          municipalityOptions={municipalityOptions}
          barangayOptions={barangayOptions}
          isLoadingProvinces={isLoadingProvinces}
          isLoadingMunicipalities={isLoadingMunicipalities}
          isLoadingBarangays={isLoadingBarangays}
          onAddressSelect={handleAddressSelect}
          onLogoSelect={handleLogoSelect}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default BarangayConfigPage;
