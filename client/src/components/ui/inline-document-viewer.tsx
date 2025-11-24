import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Button } from "@/components/ui/button";

interface InlineDocumentViewerProps {
  title?: string;
  url?: string;
  publicId?: string;
  fileType?: string;
  className?: string;
  showDownload?: boolean;
  residentId?: string;
}

/**
 * 🔒 Inline Document Viewer - Auto-loads documents
 * - Displays PDFs and images directly without requiring a click
 * - Backend authentication with time-limited signed URLs
 * - Role-based access control
 */
export function InlineDocumentViewer({
  title,
  url,
  publicId,
  fileType,
  className,
  showDownload = false,
  residentId,
}: InlineDocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if file is an image
  const isImage = fileType?.startsWith('image/');
  
  // Check if file is a PDF
  const isPdf = fileType === 'application/pdf';

  // Fetch signed URL from backend
  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!publicId || !residentId) {
        // Use stored URL if no publicId/residentId
        if (url && url.startsWith('http')) {
          setSignedUrl(url);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get(
          `/resident/${residentId}/document-url?publicId=${encodeURIComponent(publicId)}`
        );
        
        if (response.data?.url) {
          setSignedUrl(response.data.url);
        } else {
          setError('Failed to load document.');
        }
      } catch (err: any) {
        console.error('Failed to get signed URL:', err);
        
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access this document.');
        } else {
          setError('Failed to load document. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignedUrl();
  }, [publicId, residentId, url]);

  // Download document
  const downloadDocument = () => {
    if (signedUrl) {
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = title || 'document';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full min-h-[400px]", className)}>
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-full min-h-[400px]", className)}>
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // No document
  if (!signedUrl) {
    return (
      <div className={cn("flex items-center justify-center h-full min-h-[400px]", className)}>
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <p className="text-sm text-muted-foreground">Document not available</p>
        </div>
      </div>
    );
  }

  // Render PDF
  if (isPdf) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 overflow-hidden">
          <PdfViewer url={signedUrl} title={title} />
        </div>
      </div>
    );
  }

  // Render Image
  if (isImage) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <ImageViewer 
          url={signedUrl} 
          title={title}
          onDownload={showDownload ? downloadDocument : undefined}
        />
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className={cn("flex items-center justify-center h-full min-h-[400px]", className)}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Unsupported file type</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="mr-1 size-3" />
          Open in New Tab
        </Button>
      </div>
    </div>
  );
}
