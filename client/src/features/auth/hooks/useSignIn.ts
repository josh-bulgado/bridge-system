import { useMutation } from "@tanstack/react-query";
import { authService, type LoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useSignIn() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Check if email is verified
      if (!data.user.isEmailVerified) {
        toast.warning("Please verify your email to continue.");
        navigate("/email-confirmation", {
          state: {
            email: data.user.email,
            message: "Please verify your email to access your account.",
          },
        });
        return;
      }

      toast.success(`Welcome back, ${data.user.email || data.user.email}!`);

      // Redirect by role
      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/resident");
          break;
      }
    },
    onError: (error: any) => {
      // Extract error message from axios error response
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || error.message || "Sign-in failed";
      toast.error(errorMessage);
    },
  });
}
