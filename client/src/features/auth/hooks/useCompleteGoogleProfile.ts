import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CompleteGoogleProfileData {
  idToken: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extension?: string;
  dateOfBirth: string;
  contactNumber: string;
}

export function useCompleteGoogleProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteGoogleProfileData) =>
      authService.completeGoogleProfile(data.idToken, {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        extension: data.extension,
        dateOfBirth: data.dateOfBirth,
        contactNumber: data.contactNumber,
      }),
    onSuccess: (response) => {
      // Clear React Query cache before navigating
      queryClient.clear();
      
      toast.success("Account created successfully! Welcome to Bridge.");

      // Navigate based on user role
      if (response.user.role === "resident") {
        navigate("/resident", { replace: true });
      } else if (response.user.role === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else if (response.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
