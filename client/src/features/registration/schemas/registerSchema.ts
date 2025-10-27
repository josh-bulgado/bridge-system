// formSchema.ts
import { z } from "zod";

export const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    extensionName: z.string().optional(),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    contactNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => {
        // Remove all non-digit characters
        const digitsOnly = val.replace(/\D/g, "");
        // Philippine mobile numbers: 09XXXXXXXXX (11 digits) or +639XXXXXXXXX (12 digits with country code)
        const philippinePatterns = [
          /^09[0-9]{9}$/, // 09XXXXXXXXX format
          /^\+639[0-9]{9}$/, // +639XXXXXXXXX format
          /^639[0-9]{9}$/, // 639XXXXXXXXX format (without + symbol)
        ];
        return philippinePatterns.some((pattern) => pattern.test(digitsOnly));
      }, "Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;