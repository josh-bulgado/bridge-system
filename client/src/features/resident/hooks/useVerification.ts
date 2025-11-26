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

  const resetForm = () => {
    setIsSubmitted(false);
    form.reset();
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      // Removed: Don't log form data with personal information
      
      // Validate that all required files are uploaded
      if (!data.governmentIdFront || !data.governmentIdBack || !data.proofOfResidency) {
        toast.error("Please upload all required documents before submitting.");
        return;
      }
      
      // Map camelCase to PascalCase for C# backend
      const submissionData = {
        StreetPurok: data.streetPurok,
        HouseNumberUnit: data.houseNumberUnit,
        GovernmentIdType: data.governmentIdType,
        GovernmentIdFront: data.governmentIdFront,
        GovernmentIdFrontUrl: data.governmentIdFrontUrl,
        GovernmentIdFrontFileType: data.governmentIdFrontFileType,
        GovernmentIdBack: data.governmentIdBack,
        GovernmentIdBackUrl: data.governmentIdBackUrl,
        GovernmentIdBackFileType: data.governmentIdBackFileType,
        ProofOfResidencyType: data.proofOfResidencyType,
        ProofOfResidency: data.proofOfResidency,
        ProofOfResidencyUrl: data.proofOfResidencyUrl,
        ProofOfResidencyFileType: data.proofOfResidencyFileType,
      };
      
      // Removed: Don't log submission data
      const response = await verificationService.submitVerification(submissionData);
      toast.success("Verification submitted successfully!");
      setIsSubmitted(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Removed: Don't log error details that may contain sensitive info
      
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
    resetForm,
  };
};
