import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface DeleteAccountData {
  password?: string;
  emailConfirmation: string;
  confirmationText: string;
}

export function useDeleteAccount() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: DeleteAccountData) => {
      const response = await api.delete("/user/delete-account", {
        data: data,
      });
      return response.data;
    },
    onSuccess: () => {
      // Clear all auth tokens
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      
      // Clear any other user-related data
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      
      // Redirect to landing page
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      throw new Error(
        error.response?.data?.message || "Failed to delete account"
      );
    },
  });
}
