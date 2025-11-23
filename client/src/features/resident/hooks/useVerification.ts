import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  verificationSchema,
  type VerificationFormData,
} from "../schemas/verificationSchema";
import {
  verificationService,
} from "../services/verificationService";

export const useVerification = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      streetPurok: "",
      houseNumberUnit: "",
      governmentIdType: "",
      governmentIdFront: "",
      governmentIdBack: "",
      proofOfResidencyType: "",
      proofOfResidency: "",
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      if (import.meta.env.DEV) {
        console.log("=== FORM SUBMISSION DEBUG ===");
        console.log("Raw form data:", data);
        console.log("Form field values:", {
        streetPurok: data.streetPurok,
        houseNumberUnit: data.houseNumberUnit,
        governmentIdFront: data.governmentIdFront || "MISSING",
        governmentIdBack: data.governmentIdBack || "MISSING",
        proofOfResidency: data.proofOfResidency || "MISSING",
      });
      
      }
      
      // Validate that all required files are uploaded
      if (!data.governmentIdFront || !data.governmentIdBack || !data.proofOfResidency) {
        if (import.meta.env.DEV) {
          console.error("Missing file uploads:", {
            governmentIdFront: !data.governmentIdFront,
            governmentIdBack: !data.governmentIdBack,
            proofOfResidency: !data.proofOfResidency,
          });
        }
        toast.error("Please upload all required documents before submitting.");
        return;
      }
      
      // Map camelCase to PascalCase for C# backend
      const submissionData = {
        StreetPurok: data.streetPurok,
        HouseNumberUnit: data.houseNumberUnit,
        GovernmentIdType: data.governmentIdType,
        GovernmentIdFront: data.governmentIdFront,
        GovernmentIdBack: data.governmentIdBack,
        ProofOfResidencyType: data.proofOfResidencyType,
        ProofOfResidency: data.proofOfResidency,
      };
      
      if (import.meta.env.DEV) {
        console.log("Mapped submission data:", submissionData);
      }
      
      const response = await verificationService.submitVerification(submissionData);

      if (import.meta.env.DEV) {
        console.log("✅ Verification submitted successfully:", response);
      }
      toast.success("Verification submitted successfully!");
      setIsSubmitted(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("❌ Submission failed:", error);
        console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
          statusText: error.response?.statusText,
        });
      }
      
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        "Failed to submit verification";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/resident");
  };

  return {
    form,
    isSubmitted,
    isSubmitting,
    onSubmit,
    handleBackToDashboard,
  };
};
