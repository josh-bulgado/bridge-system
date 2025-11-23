import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post("/api/user/change-password", data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    },
  });
}
