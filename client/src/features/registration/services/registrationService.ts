import { FormValues } from '../schemas/registerSchema';

export interface RegistrationRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  id: string;
  email: string;
  message: string;
  verificationRequired?: boolean;
}

class RegistrationService {
  private readonly baseUrl = '/api/auth';

  async register(data: FormValues): Promise<RegistrationResponse> {
    const registrationData: RegistrationRequest = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      extensionName: data.extensionName,
      dateOfBirth: data.dateOfBirth,
      contactNumber: data.contactNumber,
      email: data.email,
      password: data.password,
    };

    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await fetch(`${this.baseUrl}/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to check email availability');
    }

    return response.json();
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resend verification email');
    }

    return response.json();
  }
}

export const registrationService = new RegistrationService();