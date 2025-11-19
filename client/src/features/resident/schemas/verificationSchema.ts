import { z } from "zod";

// Validation schema for verification form
export const verificationSchema = z.object({
  streetPurok: z.string().min(1, "Street/Purok is required"),
  houseNumberUnit: z.string().min(1, "House number/unit is required"),
  governmentIdFront: z.string().min(1, "Government ID front is required"),
  governmentIdBack: z.string().min(1, "Government ID back is required"),
  proofOfResidency: z.string().min(1, "Proof of residency is required"),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
        return validTypes.includes(file.type);
      },
      {
        message: "File must be an image (JPEG, PNG, GIF) or PDF",
      }
    ),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;
