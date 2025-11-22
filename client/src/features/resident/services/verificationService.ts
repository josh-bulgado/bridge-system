import api from "@/lib/api";

export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface VerificationSubmissionData {
  StreetPurok: string;
  HouseNumberUnit: string;
  GovernmentIdFront: string;
  GovernmentIdBack: string;
  ProofOfResidency: string;
}

export interface VerificationResponse {
  id: string;
  status: string;
  message: string;
  submittedAt: string;
}

export const verificationService = {
  /**
   * Upload a file to the server
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/FileUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { fileId, fileName, fileSize } = response.data; // <-- fileId instead of url

    return {
      id: fileId, // <-- store the actual GridFS ID
      name: fileName,
      size: fileSize,
      url: `/FileUpload/${fileId}`, // optional: for preview/download
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
