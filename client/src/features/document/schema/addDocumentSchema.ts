import { z } from "zod";

export const addDocumentSchema = z.object({
  name: z.string().min(3, "Document name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  processingTime: z.string().min(1, "Processing time is required"),
  status: z.enum(["Active", "Inactive"]).refine((val) => val !== undefined, {
    message: "Please select a status",
  }),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is needed"),
  templateUrl: z
    .url("Invalid template URL")
    .refine((url) => url.includes("cloudinary.com"), {
      message: "Template must be uploaded through Cloudinary",
    }),
});

// Ensure correct typing with zod's infer
export type AddDocumentFormValues = z.infer<typeof addDocumentSchema>;
