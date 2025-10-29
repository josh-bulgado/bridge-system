import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrationApi } from "../services/registrationService";

export const useRegistration = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registrationApi.register, // ✅ uses your service directly

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("✅ Registration successful:", data);
    },

    onError: (error) => {
      console.error("❌ Registration failed:", error.message || error);
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    success: mutation.isSuccess,
    error: mutation.error?.message || null,
    data: mutation.data,
    reset: mutation.reset,
    clearError: mutation.reset,
  };
};
