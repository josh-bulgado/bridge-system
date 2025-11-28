import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InlineDocumentViewer } from "@/components/ui/inline-document-viewer";
import { CheckCircle, Download } from "lucide-react";
import type { DocumentRequest } from "../types/documentRequest";

interface GeneratedDocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DocumentRequest;
}

export function GeneratedDocumentViewer({
  open,
  onOpenChange,
  request,
}: GeneratedDocumentViewerProps) {
  if (!request.generatedDocumentUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Generated Document - {request.documentType}</DialogTitle>
          <DialogDescription>
            Tracking Number: <code className="text-xs font-mono font-semibold">{request.trackingNumber}</code>
          </DialogDescription>
        </DialogHeader>
        <div className="h-[75vh]">
          <InlineDocumentViewer
            title={`${request.documentType} - ${request.residentName}`}
            url={request.generatedDocumentUrl}
            publicId=""
            fileType="application/pdf"
          />
        </div>
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Generated on {request.generatedAt ? new Date(request.generatedAt).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }) : "N/A"}</span>
            {request.generatedByName && (
              <>
                <span>by</span>
                <span className="font-medium">{request.generatedByName}</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(request.generatedDocumentUrl, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
