import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<any>;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  className?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

export function FileUploader({
  onUpload,
  accept = "image/*,.pdf",
  maxSize = 10,
  label = "Upload File",
  description,
  className,
  showPreview = true,
  disabled = false,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/") && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress (since we can't track actual upload progress easily)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await onUpload(file);
      setUploadProgress(100);
      
      toast.success("File uploaded successfully", {
        description: `${file.name} has been uploaded.`,
      });

      // Clear after successful upload
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
      }, 1000);

      return result;
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Please try again.",
      });
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
  };

  const isImage = file?.type.startsWith("image/");

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="space-y-1">
          <Label>{label}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {!file ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
              "hover:bg-accent hover:border-primary",
              disabled || uploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            )}
          >
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground">Max size: {maxSize}MB</p>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            {preview && isImage ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-muted rounded">
                {isImage ? (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <FileIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress value={uploadProgress} className="h-2" />
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  );
}
