import { z } from "zod";

export const completeGoogleProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  extension: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactNumber: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(/^9[0-9]{9}$/, "Phone number must start with 9 and be 10 digits long"),
});

export type CompleteGoogleProfileFormData = z.infer<typeof completeGoogleProfileSchema>;
