import api from "@/lib/api";

export interface UploadedFile {
  id: string;
  url: string;
  publicId: string;
  name: string;
  size: number;
}

export interface VerificationSubmissionData {
  StreetPurok: string;
  HouseNumberUnit: string;
  GovernmentIdFront: string; // Cloudinary public ID
  GovernmentIdBack: string; // Cloudinary public ID
  ProofOfResidency: string; // Cloudinary public ID
}

export interface VerificationResponse {
  id: string;
  status: string;
  message: string;
  submittedAt: string;
}

export const verificationService = {
  /**
   * Upload a file to the server using Cloudinary with security measures
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    // Security validation: File type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Only JPG, PNG, WEBP, PDF, and DOCX files are allowed.');
    }

    // Security validation: File size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 20MB limit. Please upload a smaller file.');
    }

    // Security validation: File name sanitization
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const formData = new FormData();
    formData.append("file", file);

    // Use Cloudinary verification document endpoint
    const response = await api.post("/FileUpload/verification-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { url, publicId, message } = response.data;

    // Security: Don't log sensitive URLs in production
    if (import.meta.env.DEV) {
      console.log("✅ File uploaded successfully");
      // Don't log the full URL to prevent exposure
    }

    // Return sanitized data
    return {
      id: publicId, // Store Cloudinary public ID
      publicId: publicId, // For deletion
      url: url, // Full Cloudinary URL (only used internally)
      name: sanitizedFileName,
      size: file.size,
    };
  },

  /**
   * Submit verification request
   */
  submitVerification: async (
    data: VerificationSubmissionData,
  ): Promise<VerificationResponse> => {
    if (import.meta.env.DEV) {
      console.log("Submitting verification data:", data);
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      console.log("Request headers:", {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "No token found",
      });
    }
    const response = await api.post("/resident/verification", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (import.meta.env.DEV) {
      console.log("Verification submission response:", response.data);
    }
    return response.data;
  },

  /**
   * Get verification status
   */
  getVerificationStatus: async (): Promise<{
    isVerified: boolean;
    status: string;
    submittedAt?: string;
  }> => {
    const response = await api.get("/resident/verification/status");
    return response.data;
  },
};
