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
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileImage className="h-8 w-8 text-green-600" />
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <Check size={16} /> {uploaded.name}
              </div>
              <p className="text-xs text-gray-500">
                {(uploaded.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" size="icon-lg" onClick={onRemove}>
            <X size={16}/>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <p className="mb-2 text-sm text-gray-600">{description}</p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
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
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 animate-bounce text-orange-600" />
            <p className="text-sm font-medium text-orange-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {isDragging ? (
              <>
                <Upload className="mx-auto h-8 w-8 text-orange-600" />
                <p className="text-sm font-medium text-orange-600">
                  Drop file here...
                </p>
              </>
            ) : (
              <>
                <FileImage className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium">
                  Drag and drop file here, or click to select
                </p>
                <p className="text-xs text-gray-500">Max size: 5MB</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
