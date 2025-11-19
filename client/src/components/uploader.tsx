import { useUploadFiles } from "@better-upload/client";
import { UploadDropzone } from "./upload-dropzone";

export function Uploader() {
  const { control } = useUploadFiles({ route: "image" });

  return (
    <UploadDropzone
      control={control}
      accept="image/*"
      description={{
        fileTypes: "Image files",
        maxFileSize: "5MB",
        maxFiles: 1,
      }}
    />
  );
}
