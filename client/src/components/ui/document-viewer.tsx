import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ExternalLink, Download, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { ImageViewer } from "@/components/ui/image-viewer";

interface DocumentViewerProps {
  title: string;
  url?: string;
  publicId?: string;
  fileType?: string;
  className?: string;
  showDownload?: boolean;
  residentId?: string;
}

/**
 * 🔒 Secure Document Viewer
 * - Backend authentication with time-limited signed URLs
 * - Role-based access control
 * - Document ownership verification
 */
export function DocumentViewer({
  title,
  url,
  publicId,
  fileType,
  className,
  showDownload = false,
  residentId,
}: DocumentViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);

  // Check if file is an image
  const isImage = fileType?.startsWith('image/');
  
  // Check if file is a PDF
  const isPdf = fileType === 'application/pdf';

  // Helper function to get the document URL
  const getDocumentUrl = () => {
    // Always use the stored URL from database if available (includes version number and correct path)
    if (url && url.startsWith('http')) {
      return url;
    }
    
    // Fallback to constructing from publicId (won't have version, but may work)
    if (publicId) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drc4nalg0';
      
      // For PDFs, use raw upload path (since they're uploaded as RawUploadParams)
      if (isPdf || fileType === 'application/pdf') {
        // Add .pdf extension if not already in publicId
        const pdfPublicId = publicId.endsWith('.pdf') ? publicId : `${publicId}.pdf`;
        return `https://res.cloudinary.com/${cloudName}/raw/upload/${pdfPublicId}`;
      }
      
      // For images, use raw upload path (verification docs are uploaded as raw)
      if (isImage) {
        return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
      }
      
      // Default to raw upload
      return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
    }
    
    return null;
  };

  const documentUrl = getDocumentUrl();

  // Generate PDF preview URL (first page as image)
  const getPdfPreviewUrl = () => {
    if (!isPdf) return null;
    
    // If we have the stored URL, use it as a base and modify it for preview
    if (url && url.startsWith('http')) {
      // Take the stored URL and modify it for preview
      // Replace /raw/upload/ with /image/upload/w_400,q_auto,pg_1/
      // And change .pdf to .jpg
      if (url.includes('/raw/upload/')) {
        return url
          .replace('/raw/upload/', '/image/upload/w_400,q_auto,pg_1/')
          .replace('.pdf', '.jpg');
      }
    }
    
    // Fallback: construct from publicId if available
    if (publicId) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drc4nalg0';
      const cleanPublicId = publicId.endsWith('.pdf') ? publicId.replace('.pdf', '') : publicId;
      
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,q_auto,pg_1/${cleanPublicId}.jpg`;
    }
    
    return null;
  };

  const pdfPreviewUrl = getPdfPreviewUrl();

  // Open document with backend authentication
  const openFullSize = async () => {
    // For authenticated documents, request a signed URL from backend
    if (publicId && residentId) {
      try {
        setIsLoadingSignedUrl(true);
        
        const response = await api.get(
          `resident/${residentId}/document-url?publicId=${encodeURIComponent(publicId)}`
        );
        
        if (response.data?.url) {
          // For PDFs, open in dialog viewer
          if (isPdf) {
            setSignedPdfUrl(response.data.url);
            setIsPdfDialogOpen(true);
          } else if (isImage) {
            // For images, open in dialog viewer with zoom controls
            setSignedImageUrl(response.data.url);
            setIsImageDialogOpen(true);
          } else {
            // For other files, open in new tab
            window.open(response.data.url, "_blank", "noopener,noreferrer");
          }
        } else {
          alert('Failed to load document. Please try again.');
        }
      } catch (error: any) {
        console.error('Failed to get signed URL:', error);
        
        // Handle authorization errors
        if (error.response?.status === 401) {
          alert('Your session has expired. Please log in again.');
        } else if (error.response?.status === 403) {
          alert('You do not have permission to access this document.');
        } else {
          alert('Failed to load document. Please try again.');
        }
      } finally {
        setIsLoadingSignedUrl(false);
      }
    } else if (documentUrl) {
      // Fallback: use stored URL if no publicId/residentId
      if (isPdf) {
        setSignedPdfUrl(documentUrl);
        setIsPdfDialogOpen(true);
      } else if (isImage) {
        setSignedImageUrl(documentUrl);
        setIsImageDialogOpen(true);
      } else {
        window.open(documentUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      alert('Cannot open document. Missing required information.');
    }
  };

  // Download document
  const downloadDocument = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!documentUrl) {
    return (
      <div className={cn("rounded-lg border bg-muted/30 p-6 text-center", className)}>
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-2" />
        <p className="text-sm text-muted-foreground">Document not available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {showDownload && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={downloadDocument}
          >
            <Download className="mr-1 size-3" />
            Download
          </Button>
        )}
      </div>

      {/* Document Preview */}
      {isPdf ? (
        // PDF Preview (first page as image)
        <div className="relative group rounded-lg overflow-hidden border bg-muted/30">
          {pdfPreviewUrl && !imageError ? (
            <>
              <img
                src={pdfPreviewUrl}
                alt={`${title} - Preview`}
                className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity max-h-96"
                onClick={openFullSize}
                loading="lazy"
                onError={(e) => {
                  console.log('PDF preview not available (likely untrusted account):', { publicId, pdfPreviewUrl });
                  setImageError(true);
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                PDF Preview
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </>
          ) : (
            // Fallback to icon if preview fails
            <div className="p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={openFullSize}>
              <div className="flex flex-col items-center gap-3">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">PDF Document</p>
                  <p className="text-xs text-muted-foreground mt-1">Click here to view</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : isImage && !imageError ? (
        // Image Preview
        <div className="relative group rounded-lg overflow-hidden border bg-muted/30">
          <img
            src={documentUrl}
            alt={title}
            className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity max-h-96"
            onClick={openFullSize}
            loading="lazy"
            onError={() => {
              console.error('Image failed to load:', { url: documentUrl, fileType });
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>
      ) : (
        // Generic Document Icon
        <div className="relative rounded-lg border bg-muted/30 p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs text-muted-foreground">
              {imageError ? 'Failed to load' : 'Click to view'}
            </p>
          </div>
        </div>
      )}

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {signedPdfUrl && (
            <PdfViewer url={signedPdfUrl} title={title} />
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {signedImageUrl && (
            <div className="h-[calc(90vh-80px)]">
              <ImageViewer 
                url={signedImageUrl} 
                title={title}
                onDownload={showDownload ? downloadDocument : undefined}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
