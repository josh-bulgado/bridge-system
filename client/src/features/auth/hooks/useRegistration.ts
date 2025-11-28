import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrationApi } from "../services/registrationService";
import { AxiosError } from "axios";
import type { RegisterFormData } from "../schemas/registerSchema";

export const useRegistration = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registrationApi.register(data), // ✅ uses your service directly

    // Prevent duplicate mutations
    retry: false,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (error) => {
      if (import.meta.env.DEV) {
        console.error("❌ Registration failed:", error);
      }
    },
  });

  // Extract the error message from the response
  const getErrorMessage = () => {
    if (!mutation.error) return null;

    const error = mutation.error as AxiosError<{ message?: string }>;

    // Try to get the message from the server response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Fallback to the error message
    return error.message || "Registration failed";
  };

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    success: mutation.isSuccess,
    error: getErrorMessage(),
    data: mutation.data,
    reset: mutation.reset,
    clearError: mutation.reset,
  };
};
