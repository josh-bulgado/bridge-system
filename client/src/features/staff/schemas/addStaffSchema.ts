import { z } from "zod";

export const addStaffSchema = z.object({
  email: z.email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["staff", "admin"]).refine((val) => val !== undefined, {
    message: "Please select a role",
  }),
  isActive: z.boolean().default(true),
});

export type AddStaffFormValues = z.infer<typeof addStaffSchema>;
