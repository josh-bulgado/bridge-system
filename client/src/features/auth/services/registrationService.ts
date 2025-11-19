import api from "@/lib/api";
import type { RegisterFormData } from "../schemas/registerSchema";

export const registrationApi = {
  register: (data: RegisterFormData) => {
    const serverData = {
      FirstName: data.firstName,
      MiddleName: data.middleName || null,
      LastName: data.lastName,
      Extension: data.extensionName || null,
      DateOfBirth: data.dateOfBirth,
      Email: data.email,
      ContactNumber: data.contactNumber,
      Password: data.password,
    };
    return api.post("/auth/register", serverData).then((res) => res.data);
  },

  checkEmailAvailability: (email: string) =>
    api.post("/auth/check-email", { email }).then((res) => res.data),

  resendVerificationEmail: (email: string) =>
    api.post("/auth/resend-verification", { email }).then((res) => res.data),
};
