import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GoogleSignInCheckResult {
  status: "SUCCESS" | "NEEDS_COMPLETION" | "ERROR";
  message: string;
  data?: any;
}

interface GoogleSignInInput {
  idToken: string;
}

export const useGoogleSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GoogleSignInInput) => authService.googleSignInCheck(input.idToken),
    onSuccess: (response: GoogleSignInCheckResult, variables) => {
      if (response.status === "SUCCESS") {
        // Clear React Query cache before navigating
        queryClient.clear();
        
        toast.success("Successfully signed in with Google!");

        // Navigate based on user role
        const user = response.data?.user;
        if (user?.role === "resident") {
          navigate("/resident", { replace: true });
        } else if (user?.role === "staff") {
          navigate("/staff/dashboard", { replace: true });
        } else if (user?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else if (response.status === "NEEDS_COMPLETION") {
        // Redirect to complete profile page with Google data and token
        navigate("/auth/complete-google-profile", {
          state: {
            email: response.data?.email,
            givenName: response.data?.givenName,
            familyName: response.data?.familyName,
            idToken: variables.idToken,
          },
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
