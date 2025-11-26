import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clearAllApplicationCaches } from "@/lib/cache-cleanup";

// Explicitly type the mutation result
export function useSignOut(): UseMutationResult<void, Error, void, unknown> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Clear all caches (React Query + File Cache)
      await clearAllApplicationCaches(queryClient);
      
      // Navigate to sign-in page
      navigate("/sign-in", { replace: true });
      
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout failed:", error.message || error);
      toast.error("Logout failed. Please try again.");
    },
  });
}
