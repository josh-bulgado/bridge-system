import { BarangayConfigData } from '../hooks/useBarangayConfig';

// Mock service for barangay configuration
// This will be replaced with actual API calls when backend is ready

export const configService = {
  // Get current barangay configuration
  getBarangayConfig: async (): Promise<BarangayConfigData | null> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data or null if no config exists
    const mockConfig: BarangayConfigData = {
      name: 'Barangay San Antonio',
      address: {
        region: 'National Capital Region',
        regionCode: '130000000',
        province: 'Metro Manila',
        provinceCode: '133900000',
        municipality: 'Quezon City',
        municipalityCode: '137404000',
        barangay: 'San Antonio',
        barangayCode: '137404015',
        street: '123 Main Street, Subdivision ABC',
      },
      contact: {
        phone: '+63 2 1234 5678',
        email: 'sanantonio@barangay.gov.ph',
      },
      officeHours: 'Monday-Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday: Closed',
    };
    
    return mockConfig;
  },

  // Update barangay configuration
  updateBarangayConfig: async (config: BarangayConfigData): Promise<BarangayConfigData> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would make an API call to update the configuration
    console.log('Updating barangay configuration:', config);
    
    // Mock successful response
    return config;
  },

  // Validate configuration data
  validateConfig: (config: Partial<BarangayConfigData>): string[] => {
    const errors: string[] = [];
    
    if (!config.name?.trim()) {
      errors.push('Barangay name is required');
    }
    
    if (!config.contact?.email?.trim()) {
      errors.push('Contact email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contact.email)) {
      errors.push('Contact email format is invalid');
    }
    
    if (!config.contact?.phone?.trim()) {
      errors.push('Contact phone is required');
    }
    
    if (!config.address?.street?.trim()) {
      errors.push('Street address is required');
    }
    
    return errors;
  },
};