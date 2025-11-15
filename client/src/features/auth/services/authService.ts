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
    isEmailVerified: boolean;
    firstName?: string;
    lastName?: string;
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
        email: data.email,
        password: data.password,
      };

      console.log("baseUrl =", this.baseUrl);

      const { data: response } = await api.post<LoginResponse>(
        `${this.baseUrl}/login`,
        loginData,
      );

      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(response.user));
      storage.setItem("auth_token", response.token);

      return response;
    } catch (error: any) {
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
  getCurrentUser(): LoginResponse | null {
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
  async verifyEmail(email: string, otp: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/verify-email`,
        { email, otp }
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Verification failed";
      throw new Error(errorMessage);
    }
  }

  // Resend OTP
  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        `${this.baseUrl}/resend-otp`,
        { email }
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend code";
      throw new Error(errorMessage);
    }
  }
}

export const authService = new AuthService();
