import { useCachedImage } from '@/hooks/useCachedImage';
import { Skeleton } from './skeleton';
import { AlertCircle } from 'lucide-react';

interface CachedImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Cached image component that securely loads and caches images with authentication
 * Automatically handles loading states and errors
 */
export function CachedImage({ src, alt, className, fallback }: CachedImageProps) {
  const { objectUrl, loading, error } = useCachedImage(src);

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        {fallback || <span className="text-sm text-muted-foreground">No image</span>}
      </div>
    );
  }

  if (loading) {
    return <Skeleton className={className} />;
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-muted ${className}`}>
        <AlertCircle className="h-8 w-8 text-destructive" />
        <span className="text-xs text-muted-foreground">Failed to load image</span>
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        {fallback || <span className="text-sm text-muted-foreground">No image</span>}
      </div>
    );
  }

  return <img src={objectUrl} alt={alt} className={className} />;
}

interface CachedPdfViewerProps {
  src: string | undefined | null;
  className?: string;
  title?: string;
}

/**
 * Cached PDF viewer component that securely loads and caches PDFs with authentication
 */
export function CachedPdfViewer({ src, className, title = 'Document' }: CachedPdfViewerProps) {
  const { objectUrl, loading, error } = useCachedImage(src);

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <span className="text-sm text-muted-foreground">No document</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <span className="text-sm text-muted-foreground">Loading document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-muted ${className}`}>
        <AlertCircle className="h-8 w-8 text-destructive" />
        <span className="text-sm text-muted-foreground">Failed to load document</span>
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <span className="text-sm text-muted-foreground">No document</span>
      </div>
    );
  }

  return (
    <iframe
      src={objectUrl}
      className={className}
      title={title}
      style={{ border: 'none' }}
    />
  );
}
