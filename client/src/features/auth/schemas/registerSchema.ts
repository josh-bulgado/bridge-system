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
      .regex(/^(09|\+639)\d{9}$/, "Invalid Philippine number"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;
