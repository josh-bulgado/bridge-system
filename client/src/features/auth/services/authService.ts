import api from "@/lib/api";
import type { SignInFormData } from "../schemas/signInSchema";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string; // Store actual JWT token from backend
  user: {
    id: string;
    email: string;
    role: "resident" | "staff" | "admin";
    isActive: boolean;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName?: string;
  };
}

export interface AuthError {
  message: string;
  error?: string;
}

class AuthService {
  private readonly baseUrl = "/auth"; // now used

  // Login function
  async login(data: SignInFormData): Promise<LoginResponse> {
    try {
      const loginData = {
        Email: data.email,
        Password: data.password,
      };

      const { data: response } = await api.post<LoginResponse>(
        `${this.baseUrl}/login`,
        loginData,
      );

      if (import.meta.env.DEV) {
        console.log("AuthService login response =", response);
      }

      // Clear all existing auth data first (from both storages)
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("auth_token");

      // Store new user data in the appropriate storage
      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(response.user));
      storage.setItem("auth_token", response.token);

      return response;
    } catch (error: Error | any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  }

  // Logout function
  async logout(): Promise<void> {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("auth_token");
  }

  // Get current user from storage
  getCurrentUser(): LoginResponse["user"] | null {
    try {
      const userData =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Check if authenticated (has token)
  isAuthenticated(): boolean {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    return !!token;
  }

  // Verify email with OTP
  async verifyEmail(email: string, otp: string): Promise<{ message: string; token?: string; user?: LoginResponse["user"] }> {
    try {
      const { data } = await api.post<{ message: string; token?: string; user?: LoginResponse["user"] }>(
        `${this.baseUrl}/verify-email`,
        { Email: email, Otp: otp },
      );

      if (import.meta.env.DEV) {
        console.log("AuthService verifyEmail response =", data);
      }

      // If token and user are returned, store them (auto-login after verification)
      if (data.token && data.user) {
        // Clear all existing auth data first
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("auth_token");

        // Store new user data in localStorage (remember me by default)
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("auth_token", data.token);
      }

      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Verification failed";
      throw new Error(errorMessage);
    }
  }

  // Resend OTP
  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/resend-otp`,
        { Email: email },
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend code";
      throw new Error(errorMessage);
    }
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/forgot-password`,
        { Email: email },
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      throw new Error(errorMessage);
    }
  }

  // Verify OTP for password reset (validate before showing password fields)
  async verifyResetOtp(email: string, otp: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/verify-reset-otp`,
        { Email: email, Otp: otp },
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid or expired code";
      throw new Error(errorMessage);
    }
  }

  // Reset Password
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/reset-password`,
        { Email: email, Otp: otp, NewPassword: newPassword },
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      throw new Error(errorMessage);
    }
  }

  // Google Sign-In Check
  async googleSignInCheck(idToken: string): Promise<{
    status: "SUCCESS" | "NEEDS_COMPLETION" | "ERROR";
    message: string;
    data?: any;
  }> {
    try {
      const { data: response } = await api.post(
        `${this.baseUrl}/google-signin/check`,
        { IdToken: idToken },
      );

      if (import.meta.env.DEV) {
        console.log("AuthService googleSignInCheck response =", response);
      }

      // If SUCCESS, clear old session and store new token and user data
      if (response.status === "SUCCESS" && response.data) {
        // Clear all existing auth data first
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("auth_token");
        
        // Store new user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("auth_token", response.data.token);
      }

      return response;
    } catch (error: Error | any) {
      const errorMessage = error.response?.data?.message || "Google Sign-In failed";
      throw new Error(errorMessage);
    }
  }

  // Complete Google Profile
  async completeGoogleProfile(
    idToken: string,
    profileData: {
      firstName: string;
      middleName?: string;
      lastName: string;
      extension?: string;
      dateOfBirth: string;
      contactNumber: string;
    }
  ): Promise<LoginResponse> {
    try {
      const { data: response } = await api.post<LoginResponse>(
        `${this.baseUrl}/google-signin/complete`,
        {
          IdToken: idToken,
          FirstName: profileData.firstName,
          MiddleName: profileData.middleName,
          LastName: profileData.lastName,
          Extension: profileData.extension,
          DateOfBirth: profileData.dateOfBirth,
          ContactNumber: profileData.contactNumber,
        },
      );

      if (import.meta.env.DEV) {
        console.log("AuthService completeGoogleProfile response =", response);
      }

      // Clear all existing auth data first
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("auth_token");
      
      // Store new user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("auth_token", response.token);

      return response;
    } catch (error: Error | any) {
      const errorMessage = error.response?.data?.message || "Failed to complete profile";
      throw new Error(errorMessage);
    }
  }

  // Check Email Availability
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const { data } = await api.get<{ available: boolean }>(
        `${this.baseUrl}/check-email-availability`,
        { params: { email } }
      );
      
      // 🔒 Security: Only log in development mode, and mask the email
      if (import.meta.env.DEV) {
        const maskedEmail = email.substring(0, 3) + "***@" + email.split("@")[1];
        console.log(`Email availability check for ${maskedEmail}:`, data.available ? "Available" : "Not available");
      }
      
      return data;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Email availability check error:", error.message);
        console.error("Error status:", error.response?.status);
      }
      
      // Only return false if we get a definitive response from the server
      // Otherwise, throw the error so the UI can handle it appropriately
      if (error.response?.status === 400 || error.response?.status === 409) {
        return { available: false };
      }
      
      // For network errors, server errors, etc., throw so the UI shows an error state
      throw error;
    }
  }
}

export const authService = new AuthService();
