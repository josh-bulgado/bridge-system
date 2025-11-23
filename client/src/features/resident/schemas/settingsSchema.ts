import { z } from "zod";

// Security: Name validation regex - only letters, spaces, hyphens, and apostrophes
const nameRegex = /^[a-zA-Z\s'-]+$/;

export const personalInfoSchema = z.object({
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
    .optional()
    .or(z.literal("")),
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
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  barangay: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
