import { useState, useCallback } from "react";
import { IconUpload, IconFile, IconX, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUploadDocument } from "@/hooks/useUploadFile";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

interface MultiFileUploadZoneProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export function MultiFileUploadZone({ 
  onUploadComplete, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024 // 10MB default
}: MultiFileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { mutateAsync: uploadDocument } = useUploadDocument();

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    try {
      console.log("Uploading file:", file.name, "Size:", file.size);
      const response = await uploadDocument({ 
        file, 
        folder: "supporting-documents" 
      });
      console.log("Upload response:", response);
      
      return {
        name: file.name,
        url: response.url,
        size: file.size,
      };
    } catch (error) {
      console.error("Upload error for", file.name, ":", error);
      throw error;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    console.log("=== MULTI FILE UPLOAD ===");
    console.log("Files selected:", fileArray.length);
    console.log("Already uploaded:", uploadedFiles.length);
    console.log("Total would be:", uploadedFiles.length + fileArray.length);
    console.log("Max allowed:", maxFiles);
    
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed. You already have ${uploadedFiles.length} file(s) uploaded.`);
      return;
    }

    // Check file sizes
    const oversizedFiles = fileArray.filter(f => f.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Check file types - only images allowed
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const invalidFiles = fileArray.filter(f => !allowedTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      toast.error(`Only PNG, JPG, and JPEG images are allowed`);
      console.error("Invalid file types:", invalidFiles.map(f => `${f.name} (${f.type})`));
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = fileArray.map(file => uploadFile(file));
      const newFiles = await Promise.all(uploadPromises);
      
      console.log("All files uploaded:", newFiles);
      
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      
      const allUrls = updatedFiles.map(f => f.url);
      console.log("Calling onUploadComplete with URLs:", allUrls);
      onUploadComplete(allUrls);
      
      toast.success(`${fileArray.length} file(s) uploaded successfully to Cloudinary`);
    } catch (error) {
      toast.error("Failed to upload files to Cloudinary");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  }, [uploadedFiles, maxFiles, maxSize, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!uploading) {
      handleFiles(e.dataTransfer.files);
    }
  }, [uploading, handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onUploadComplete(updatedFiles.map(f => f.url));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {uploadedFiles.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            disabled={uploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <IconLoader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <IconUpload className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG images up to {maxSize / (1024 * 1024)}MB each
              </p>
              <p className="text-xs font-medium text-primary">
                You can upload up to {maxFiles - uploadedFiles.length} more file(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <IconFile className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0"
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
