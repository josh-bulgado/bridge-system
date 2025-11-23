import { z } from "zod";

// Government ID types accepted in the Philippines
export const GOVERNMENT_ID_TYPES = [
  { value: "philsys", label: "PhilSys ID (National ID)" },
  { value: "passport", label: "Philippine Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "umid", label: "UMID (Unified Multi-Purpose ID)" },
  { value: "sss", label: "SSS ID" },
  { value: "gsis", label: "GSIS e-Card" },
  { value: "tin", label: "TIN ID" },
  { value: "postal", label: "Postal ID" },
  { value: "voters", label: "Voter's ID" },
  { value: "prc", label: "PRC ID (Professional Regulation Commission)" },
  { value: "senior_citizen", label: "Senior Citizen ID" },
  { value: "pwd", label: "PWD ID (Person with Disability)" },
  { value: "owwa", label: "OWWA ID (Overseas Workers Welfare Administration)" },
] as const;

// Proof of Residency document types
export const PROOF_OF_RESIDENCY_TYPES = [
  { value: "barangay_certificate", label: "Barangay Certificate of Residency" },
  { value: "utility_bill", label: "Utility Bill (Water, Electric, Internet)" },
  { value: "lease_contract", label: "Lease/Rental Contract" },
  { value: "house_title", label: "House Title/Deed of Sale" },
  { value: "tax_declaration", label: "Real Property Tax Declaration" },
  { value: "bank_statement", label: "Bank Statement with Address" },
  { value: "billing_statement", label: "Credit Card/Billing Statement" },
  { value: "government_mail", label: "Government-issued Mail/Document" },
  { value: "sworn_affidavit", label: "Sworn Affidavit of Residency" },
] as const;

// Validation schema for verification form
export const verificationSchema = z.object({
  streetPurok: z.string().min(1, "Street/Purok is required"),
  houseNumberUnit: z.string().min(1, "House number/unit is required"),
  governmentIdType: z.string().min(1, "Please select your ID type"),
  governmentIdFront: z.string().min(1, "Government ID front is required"),
  governmentIdBack: z.string().min(1, "Government ID back is required"),
  proofOfResidencyType: z.string().min(1, "Please select proof of residency type"),
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
