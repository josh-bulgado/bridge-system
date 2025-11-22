import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Explicitly type the mutation result
export function useSignOut(): UseMutationResult<void, Error, void, unknown> {
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      navigate("/sign-in");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout failed:", error.message || error);
    },
  });
}
