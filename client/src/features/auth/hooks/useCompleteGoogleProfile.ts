import { useMutation } from "@tanstack/react-query";
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
      toast.success("Account created successfully! Welcome to Bridge.");

      // Navigate based on user role
      if (response.user.role === "resident") {
        navigate("/resident");
      } else if (response.user.role === "staff") {
        navigate("/staff/dashboard");
      } else if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
