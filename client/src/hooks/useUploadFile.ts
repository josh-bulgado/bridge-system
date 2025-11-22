import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface UploadResponse {
  message: string;
  url: string;
  publicId: string;
}

interface UploadImageOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Hook to upload profile picture
 */
export function useUploadProfilePicture() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<UploadResponse>(
        "/FileUpload/profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    },
  });
}

/**
 * Hook to upload an image
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: async ({
      file,
      options,
    }: {
      file: File;
      options?: UploadImageOptions;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      if (options?.folder) {
        formData.append("folder", options.folder);
      }
      if (options?.maxWidth) {
        formData.append("maxWidth", options.maxWidth.toString());
      }
      if (options?.maxHeight) {
        formData.append("maxHeight", options.maxHeight.toString());
      }

      const response = await api.post<UploadResponse>(
        "/FileUpload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    },
  });
}

/**
 * Hook to upload a document (PDF, DOCX, images)
 */
export function useUploadDocument() {
  return useMutation({
    mutationFn: async ({
      file,
      folder = "documents",
    }: {
      file: File;
      folder?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await api.post<UploadResponse>(
        "/FileUpload/document",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    },
  });
}

/**
 * Hook to upload verification document
 */
export function useUploadVerificationDocument() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<UploadResponse>(
        "/FileUpload/verification-document",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    },
  });
}

/**
 * Hook to delete a file from Cloudinary
 */
export function useDeleteFile() {
  return useMutation({
    mutationFn: async ({
      publicId,
      isDocument = false,
    }: {
      publicId: string;
      isDocument?: boolean;
    }) => {
      const response = await api.delete("/FileUpload", {
        params: { publicId, isDocument },
      });

      return response.data;
    },
  });
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number,
  crop: string = "limit"
): Promise<string> {
  return api
    .get<{ url: string }>("/FileUpload/optimize-url", {
      params: { publicId, width, height, crop },
    })
    .then((res) => res.data.url);
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(
  publicId: string,
  size: number = 150
): Promise<string> {
  return api
    .get<{ url: string }>("/FileUpload/thumbnail-url", {
      params: { publicId, size },
    })
    .then((res) => res.data.url);
}
