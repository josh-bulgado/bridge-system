import { useMutation } from "@tanstack/react-query";
import { authService, type LoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useSignIn() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
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
    onError: (error: Error) => {
      toast.error(error.message || "Sign-in failed");
    },
  });
}
