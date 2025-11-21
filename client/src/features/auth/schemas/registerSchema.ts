// formSchema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional().or(z.literal("")),
    lastName: z.string().min(1, "Last name is required"),
    extensionName: z.string().nullable(),
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
