// formSchema.ts
import { z } from "zod";

// Security: Name validation regex - only letters, spaces, hyphens, and apostrophes
const nameRegex = /^[a-zA-Z\s'-]+$/;

export const registerSchema = z
  .object({
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
    extensionName: z
      .string()
      .max(10, "Extension must not exceed 10 characters")
      .regex(/^[a-zA-Z.\s]*$/, "Extension can only contain letters, dots, and spaces")
      .nullable(),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    contactNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => {
        // Remove all non-digit characters
        const digitsOnly = val.replace(/\D/g, "");
        // Must be exactly 10 digits (9XXXXXXXXX format, since +63 prefix is already provided)
        return /^9[0-9]{9}$/.test(digitsOnly);
      }, "Please enter a valid 10-digit mobile number starting with 9 (e.g., 9123456789)"),
    civilStatus: z
      .string()
      .min(1, "Civil status is required")
      .refine(
        (val) => ["Single", "Married", "Widowed", "Divorced", "Separated"].includes(val),
        "Please select a valid civil status"
      ),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    website: z.string().optional(), // Honeypot field
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
