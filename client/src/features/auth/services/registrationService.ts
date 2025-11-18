import api from "@/lib/api";
import type { RegisterFormData } from "../schemas/registerSchema";

export const registrationApi = {
  register: (data: RegisterFormData) => {
    const serverData = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      extension: data.extensionName, // Map extensionName to extension
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      contactNumber: data.contactNumber, // Map contactNumber to phoneNumber
      password: data.password,
    };
    console.log("Sending registration data:", serverData);
    return api.post("/auth/register", serverData).then((res) => res.data);
  },

  checkEmailAvailability: (email: string) =>
    api.post("/auth/check-email", { email }).then((res) => res.data),

  resendVerificationEmail: (email: string) =>
    api.post("/auth/resend-verification", { email }).then((res) => res.data),
};
