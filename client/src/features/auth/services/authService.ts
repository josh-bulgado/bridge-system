import api from "@/lib/api";
import type { SignInFormData } from "../schemas/signInSchema";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  message: string;
}

export interface AuthError {
  message: string;
  error?: string;
}

class AuthService {
  private readonly baseUrl = "/api/auth";

  async login(data: SignInFormData): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const response = await api.post<LoginResponse>(
        `/resident/login`,
        loginData,
      );

      // Store user data in localStorage if login is successful
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));

        // If remember me is checked, store in localStorage, otherwise sessionStorage
        const storage = data.rememberMe ? localStorage : sessionStorage;
        storage.setItem("auth_token", "logged_in"); // Placeholder for actual token
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    // Clear stored user data
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }

  getCurrentUser(): LoginResponse | null {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    return !!token;
  }

  // Check if user data exists in storage
  hasUserSession(): boolean {
    return !!localStorage.getItem("user");
  }
}

export const authService = new AuthService();
