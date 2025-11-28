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
      <div className="bg-muted/30 rounded-lg border-2 border-dashed py-12">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-4">
              <AlertCircle className="text-muted-foreground h-8 w-8" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No Supporting Documents</p>
            <p className="text-muted-foreground text-xs">
              The resident has not uploaded any documents yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">
          {documents.length} {documents.length === 1 ? "Document" : "Documents"}{" "}
          Uploaded
        </p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {documents.map((docUrl, index) => (
          <div
            key={index}
            className="group border-border hover:border-primary bg-card cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg"
            onClick={() =>
              onImagePreview(docUrl, `Supporting Document ${index + 1}`)
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Document {index + 1}
                </Label>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 relative overflow-hidden rounded-md">
                <img
                  src={docUrl}
                  alt={`Supporting Document ${index + 1}`}
                  className="h-40 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>
              <p className="text-muted-foreground text-center text-xs font-medium">
                Click to view full size
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
