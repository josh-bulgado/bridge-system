import api from "@/lib/api";
import type { BarangayConfigFormData } from "../schemas/barangayConfigSchema";

export interface BarangayConfigResponse {
  id: string;
  address: {
    regionCode: string;
    regionName: string;
    provinceCode: string;
    provinceName: string;
    municipalityCode: string;
    municipalityName: string;
    barangayCode: string;
    barangayName: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  officeHours: string;
  createdAt: string;
  updatedAt: string;
}

export interface BarangayConfigError {
  message: string;
  error?: string;
}

class BarangayConfigService {
  private readonly baseUrl = "/BarangayConfig";

  // Get current barangay configuration
  async getBarangayConfig(): Promise<BarangayConfigFormData | null> {
    try {
      const { data: response } = await api.get<BarangayConfigResponse>(
        `${this.baseUrl}`,
      );

      // Transform backend response to frontend format
      return {
        address: {
          regionCode: response.address.regionCode,
          regionName: response.address.regionName,
          provinceCode: response.address.provinceCode,
          provinceName: response.address.provinceName,
          municipalityCode: response.address.municipalityCode,
          municipalityName: response.address.municipalityName,
          barangayCode: response.address.barangayCode,
          barangayName: response.address.barangayName,
        },
        contact: {
          phone: response.contact.phone,
          email: response.contact.email,
        },
        officeHours: response.officeHours,
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch barangay config";
      throw new Error(errorMessage);
    }
  }

  // Create or update barangay configuration
  async saveBarangayConfig(
    config: BarangayConfigFormData,
  ): Promise<BarangayConfigFormData> {
    try {
      const requestBody = {
        address: {
          regionCode: config.address.regionCode,
          regionName: config.address.regionName,
          provinceCode: config.address.provinceCode,
          provinceName: config.address.provinceName,
          municipalityCode: config.address.municipalityCode,
          municipalityName: config.address.municipalityName,
          barangayCode: config.address.barangayCode,
          barangayName: config.address.barangayName,
        },
        contact: {
          phone: config.contact.phone,
          email: config.contact.email,
        },
        officeHours: config.officeHours,
      };

      const { data: response } = await api.post<BarangayConfigFormData>(
        `${this.baseUrl}`,
        requestBody,
      );

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to save barangay config";
      throw new Error(errorMessage);
    }
  }

  // Check if configuration exists
  async checkConfigExists(): Promise<boolean> {
    try {
      const { data } = await api.get<{ exists: boolean }>(
        `${this.baseUrl}/exists`,
      );

      return data.exists;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to check if config exists";
      throw new Error(errorMessage);
    }
  }
}

export const barangayConfigService = new BarangayConfigService();
