import * as React from "react";
import { Label } from "@/components/ui/label";
import { Eye, AlertCircle } from "lucide-react";

interface SupportingDocumentsGridProps {
  documents?: string[];
  onImagePreview: (url: string, title: string) => void;
}

export function SupportingDocumentsGrid({
  documents,
  onImagePreview,
}: SupportingDocumentsGridProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed bg-muted/30 py-12">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No Supporting Documents</p>
            <p className="text-xs text-muted-foreground">The resident has not uploaded any documents yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {documents.length} {documents.length === 1 ? 'Document' : 'Documents'} Uploaded
        </p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {documents.map((docUrl, index) => (
          <div 
            key={index} 
            className="group rounded-lg border-2 border-border hover:border-primary p-4 bg-card cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => onImagePreview(docUrl, `Supporting Document ${index + 1}`)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Document {index + 1}
                </Label>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-md bg-muted/30">
                <img 
                  src={docUrl} 
                  alt={`Supporting Document ${index + 1}`} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <p className="text-xs text-center text-muted-foreground font-medium">
                Click to view full size
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
