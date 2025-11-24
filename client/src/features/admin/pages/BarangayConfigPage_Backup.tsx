import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Building2,
  User,
  ImageIcon,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

interface AddressOption {
  code: string;
  name: string;
}

const BarangayConfigPage: React.FC = () => {
  // View/Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Hooks
  const { data: existingConfig, isLoading: isLoadingConfig } =
    useFetchBarangayConfig();
  console.log("Existing config:", existingConfig);
  const saveMutation = useSaveBarangayConfig();
  const { logoPreview, isUploading, handleLogoUpload, removeLogo } =
    useUploadBarangayLogo();

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

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    reset,
    trigger,
  } = form;

  // Address options state
  const [regionOptions, setRegionOptions] = useState<AddressOption[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<
    AddressOption[]
  >([]);
  const [barangayOptions, setBarangayOptions] = useState<AddressOption[]>([]);

  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);

  const [barangayComboOpen, setBarangayComboOpen] = useState(false);

  // Watch form values
  const watchedAddress = watch("address");
  const watchedLogoUrl = watch("logoUrl");
  const watchedBarangayName = watch("address.barangayName");
  const watchedCaptain = watch("barangayCaptain");

  // Load regions on mount and existing config
  useEffect(() => {
    const loadRegions = async () => {
      const regionData = await regions();
      setRegionOptions(
        regionData.map((region: any) => ({
          code: region.region_code,
          name: region.region_name,
        })),
      );
    };
    loadRegions();
  }, []);

  // Determine initial mode based on existing config
  useEffect(() => {
    console.log("=== EXISTING CONFIG CHECK ===");
    console.log("existingConfig:", existingConfig);
    console.log("Has config?", !!existingConfig);
    
    if (existingConfig) {
      // Config exists - start in view mode
      console.log("Config exists - switching to VIEW mode");
      setIsEditMode(false);
    } else {
      // No config - start in edit mode (create)
      console.log("No config - switching to EDIT mode");
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
          const provinceData = await provinces(
            existingConfig.address.regionCode,
          );
          setProvinceOptions(
            provinceData.map((province: any) => ({
              code: province.province_code,
              name: province.province_name,
            })),
          );

          if (existingConfig.address.provinceCode) {
            const municipalityData = await cities(
              existingConfig.address.provinceCode,
            );
            setMunicipalityOptions(
              municipalityData.map((municipality: any) => ({
                code: municipality.city_code,
                name: municipality.city_name,
              })),
            );

            if (existingConfig.address.municipalityCode) {
              const barangayData = await barangays(
                existingConfig.address.municipalityCode,
              );
              setBarangayOptions(
                barangayData.map((barangay: any) => ({
                  code: barangay.brgy_code,
                  name: barangay.brgy_name,
                })),
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
          })),
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
          })),
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
          })),
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
    option: AddressOption,
  ) => {
    switch (type) {
      case "region":
        setValue("address.regionCode", option.code);
        setValue("address.regionName", option.name);
        // Clear dependent fields
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
        // Clear dependent fields
        setValue("address.municipalityCode", "");
        setValue("address.municipalityName", "");
        setValue("address.barangayCode", "");
        setValue("address.barangayName", "");
        break;
      case "municipality":
        setValue("address.municipalityCode", option.code);
        setValue("address.municipalityName", option.name);
        // Clear dependent fields
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

    await handleLogoUpload(file, async (url, publicId) => {
      console.log("Setting logoUrl to:", url);
      setValue("logoUrl", url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      console.log("logoUrl after setValue:", watch("logoUrl"));

      // Manually trigger validation
      await trigger("logoUrl");
      console.log("Validation triggered, errors:", errors.logoUrl);
    });

    // Clear the input so the same file can be selected again
    e.target.value = "";
  };

  // Handle form submission
  const onSubmit = async (data: BarangayConfigFormData) => {
    console.log("=== FORM SUBMISSION ===");
    console.log("Form data on submit:", data);
    console.log("Logo URL:", data.logoUrl);
    console.log("Form errors:", errors);
    console.log("Form state:", {
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
      errors: form.formState.errors,
    });
    await saveMutation.mutateAsync(data);
    // After successful save, switch to view mode
    setIsEditMode(false);
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle cancel button click
  const handleCancelEdit = () => {
    if (existingConfig) {
      // Reset form to existing config
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
    <div className="container mx-auto max-w-7xl p-6">
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
        <div className="space-y-6">
          {/* Basic Information Preview - Compact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                {/* Square Logo - 1:1 aspect ratio */}
                <Avatar className="h-20 w-20 rounded-lg">
                  <AvatarImage
                    src={existingConfig.logoUrl}
                    alt="Barangay Logo"
                    className="aspect-square object-cover"
                  />
                  <AvatarFallback className="rounded-lg text-xl">
                    {existingConfig.address.barangayName ? (
                      existingConfig.address.barangayName
                        .substring(0, 2)
                        .toUpperCase()
                    ) : (
                      <ImageIcon className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    Barangay {existingConfig.address.barangayName}
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    Captain: {existingConfig.barangayCaptain}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Preview - Compact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">
                Barangay {existingConfig.address.barangayName},{" "}
                {existingConfig.address.municipalityName},{" "}
                {existingConfig.address.provinceName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {existingConfig.address.regionName}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information Preview - Compact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{existingConfig.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📧</span>
                  <span>{existingConfig.contact.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4">
                {existingConfig.officeHours}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EDIT MODE - Form */}
      {isEditMode && (
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
                {/* Logo Upload Section */}
                <div className="space-y-4">
                  <Label>Barangay Logo *</Label>
                  {/* Hidden input for form registration */}
                  <input type="hidden" {...register("logoUrl")} />
                  <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-6">
                    <div className="relative">
                      <Avatar className="h-32 w-32 rounded-lg">
                        <AvatarImage
                          src={displayLogo || undefined}
                          alt="Barangay Logo"
                          className="aspect-square object-cover"
                        />
                        <AvatarFallback className="rounded-lg text-2xl">
                          {watchedBarangayName ? (
                            watchedBarangayName.substring(0, 2).toUpperCase()
                          ) : (
                            <ImageIcon className="h-12 w-12" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}

                      <label
                        htmlFor="logo-input"
                        className={cn(
                          "bg-primary text-primary-foreground absolute right-0 bottom-0 rounded-full p-2 transition-transform hover:scale-110",
                          isUploading
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer",
                        )}
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          id="logo-input"
                          type="file"
                          accept="image/png"
                          onChange={handleLogoSelect}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium">Upload Logo</p>
                      <p className="text-muted-foreground text-xs">
                        PNG format only, max 5MB
                      </p>
                    </div>
                  </div>
                  {errors.logoUrl && (
                    <p className="text-sm text-red-500">
                      {errors.logoUrl.message}
                    </p>
                  )}
                </div>

                {/* Barangay Captain Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="barangayCaptain"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Barangay Captain *
                    </Label>
                    <Input
                      id="barangayCaptain"
                      {...register("barangayCaptain")}
                      placeholder="Enter captain's full name"
                      className={errors.barangayCaptain ? "border-red-500" : ""}
                    />
                    {errors.barangayCaptain && (
                      <p className="text-sm text-red-500">
                        {errors.barangayCaptain.message}
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      Full name of the current Barangay Captain
                    </p>
                  </div>

                  {/* Preview Section */}
                  {watchedBarangayName && (
                    <div className="bg-muted/50 mt-6 rounded-lg border p-4">
                      <Label className="text-sm font-medium">Preview:</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage
                            src={displayLogo || undefined}
                            alt="Logo preview"
                            className="aspect-square object-cover"
                          />
                          <AvatarFallback className="rounded-lg text-xs">
                            {watchedBarangayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            Barangay {watchedBarangayName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {watchedCaptain || "Captain name"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Address Information Card - Keep existing code */}
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
                    {...register("contact.phone")}
                    placeholder="+63 9XX XXX XXXX"
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
                    {...register("contact.email")}
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
                <Label htmlFor="officeHours">Office Hours *</Label>
                <Textarea
                  id="officeHours"
                  {...register("officeHours")}
                  placeholder="Monday-Friday: 8:00 AM - 5:00 PM&#10;Saturday: 8:00 AM - 12:00 PM&#10;Sunday: Closed"
                  rows={4}
                  className="resize-none"
                />
                {errors.officeHours && (
                  <p className="text-sm text-red-500">
                    {errors.officeHours.message}
                  </p>
                )}
                <p className="text-sm text-neutral-500">
                  Enter the operating hours for barangay services
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            {existingConfig && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saveMutation.isPending}
                size="lg"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="min-w-[150px]"
              size="lg"
            >
              {saveMutation.isPending ? (
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
      )}
    </div>
  );
};

export default BarangayConfigPage;
