import api from "@/lib/api";

export interface UploadedFile {
  id: string;
  url: string;
  publicId: string;
  name: string;
  size: number;
  fileType: string; // MIME type
}

export interface VerificationSubmissionData {
  StreetPurok: string;
  HouseNumberUnit: string;
  GovernmentIdType: string;
  GovernmentIdFront: string; // Cloudinary public ID
  GovernmentIdFrontUrl?: string; // Cloudinary URL
  GovernmentIdFrontFileType?: string; // MIME type
  GovernmentIdBack: string; // Cloudinary public ID
  GovernmentIdBackUrl?: string; // Cloudinary URL
  GovernmentIdBackFileType?: string; // MIME type
  ProofOfResidencyType: string;
  ProofOfResidency: string; // Cloudinary public ID
  ProofOfResidencyUrl?: string; // Cloudinary URL
  ProofOfResidencyFileType?: string; // MIME type
}

export interface VerificationResponse {
  id: string;
  status: string;
  message: string;
  submittedAt: string;
}

export const verificationService = {
  /**
   * Upload a file to the server using Cloudinary with enhanced security measures
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    // 🔒 Security validation: File extension check
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'];
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new Error('Invalid file extension. Only JPG, PNG, WEBP, PDF, DOC, and DOCX files are allowed.');
    }

    // 🔒 Security validation: File type (MIME type)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Only JPG, PNG, WEBP, PDF, and DOCX files are allowed.');
    }

    // 🔒 Security validation: Check that extension matches MIME type
    const mimeToExtension: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/jpg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp'],
      'application/pdf': ['pdf'],
      'application/msword': ['doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
    };

    const expectedExtensions = mimeToExtension[file.type.toLowerCase()];
    if (!expectedExtensions || !expectedExtensions.includes(fileExtension)) {
      throw new Error('File extension does not match file type. This may indicate a security risk.');
    }

    // 🔒 Security validation: File size (max 10MB for verification documents)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit. Please upload a smaller file.');
    }

    // 🔒 Security validation: Minimum file size (to prevent empty/corrupted files)
    const minSize = 1024; // 1KB minimum
    if (file.size < minSize) {
      throw new Error('File is too small or corrupted. Please upload a valid file.');
    }

    // 🔒 Security validation: File name sanitization
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Remove special characters
      .substring(0, 100); // Limit length

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use Cloudinary verification document endpoint
      const response = await api.post("/FileUpload/verification-document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Timeout for large files
        timeout: 60000, // 60 seconds
      });

      const { url, publicId, fileType } = response.data;

      // 🔒 Security: Validate response
      if (!url || !publicId) {
        throw new Error('Invalid response from server');
      }

      // 🔒 Security: Don't log sensitive information in production
      if (import.meta.env.DEV) {
        // File upload success - not logging file details
      }

      // Return sanitized data
      return {
        id: publicId, // Store Cloudinary public ID
        publicId: publicId, // For deletion
        url: url, // Full Cloudinary URL for preview
        name: sanitizedFileName,
        size: file.size,
        fileType: fileType || file.type, // Store MIME type for proper display
      };
    } catch (error: any) {
      // 🔒 Security: Don't expose internal error details to users
      if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else if (error.response?.status === 413) {
        throw new Error('File is too large. Maximum size is 10MB.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to upload file. Please check your connection and try again.');
      }
    }
  },

  /**
   * Submit verification request
   */
  submitVerification: async (
    data: VerificationSubmissionData,
  ): Promise<VerificationResponse> => {
    // Removed: Don't log verification data or tokens
    const response = await api.post("/resident/verification", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Removed: Don't log response data
    return response.data;
  },

  /**
   * Get verification status
   */
  getVerificationStatus: async (): Promise<{
    isVerified: boolean;
    status: string;
    submittedAt?: string;
    rejectionReason?: string;
  }> => {
    const response = await api.get("/resident/verification/status");
    return response.data;
  },
};
