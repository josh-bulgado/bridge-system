import { z } from "zod";

// Security: Name validation regex - only letters, spaces, hyphens, and apostrophes
const nameRegex = /^[a-zA-Z\s'-]+$/;

export const completeGoogleProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(nameRegex, "First name can only contain letters, spaces, hyphens, and apostrophes")
    .refine((val) => val.trim().length > 0, "First name cannot be empty"),
  middleName: z
    .string()
    .max(50, "Middle name must not exceed 50 characters")
    .regex(nameRegex, "Middle name can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(nameRegex, "Last name can only contain letters, spaces, hyphens, and apostrophes")
    .refine((val) => val.trim().length > 0, "Last name cannot be empty"),
  extension: z
    .string()
    .max(10, "Extension must not exceed 10 characters")
    .regex(/^[a-zA-Z.\s]*$/, "Extension can only contain letters, dots, and spaces")
    .optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactNumber: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(/^9[0-9]{9}$/, "Phone number must start with 9 and be 10 digits long"),
  civilStatus: z
    .string()
    .min(1, "Civil status is required")
    .refine(
      (val) => ["Single", "Married", "Widowed", "Divorced", "Separated"].includes(val),
      "Please select a valid civil status"
    )
    .optional(),
});

export type CompleteGoogleProfileFormData = z.infer<typeof completeGoogleProfileSchema>;
