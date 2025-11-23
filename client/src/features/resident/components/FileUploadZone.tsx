import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { FileImage, X, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
}

interface FileUploadZoneProps {
  accept: string;
  label: string;
  description: string;
  uploaded: UploadedFile | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const FileUploadZone = ({
  accept,
  label,
  description,
  uploaded,
  uploading,
  onUpload,
  onRemove,
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  if (uploaded) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 truncate">
                <Check size={14} className="flex-shrink-0" /> 
                <span className="truncate">{uploaded.name}</span>
              </div>
              <p className="text-xs text-gray-500">
                {(uploaded.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0 flex-shrink-0">
            <X size={14}/>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FormLabel className="text-sm">{label}</FormLabel>
      <p className="mb-1.5 text-xs text-muted-foreground">{description}</p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50",
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />
        {uploading ? (
          <div className="space-y-1">
            <Upload className="mx-auto h-6 w-6 animate-bounce text-blue-600 dark:text-blue-500" />
            <p className="text-xs font-medium text-blue-600 dark:text-blue-500">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-1">
            {isDragging ? (
              <>
                <Upload className="mx-auto h-6 w-6 text-blue-600 dark:text-blue-500" />
                <p className="text-xs font-medium text-blue-600 dark:text-blue-500">
                  Drop file here...
                </p>
              </>
            ) : (
              <>
                <FileImage className="mx-auto h-6 w-6 text-gray-400" />
                <p className="text-xs font-medium">
                  Drag and drop or click to select
                </p>
                <p className="text-xs text-gray-500">Max size: 10MB</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
