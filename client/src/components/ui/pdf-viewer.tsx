import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerProps {
  url: string;
  title?: string;
}

/**
 * 🔒 PDF Viewer with Basic Security
 * - Time-limited signed URLs from backend
 * - Simple, functional display
 */
export function PdfViewer({ url, title }: PdfViewerProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden border bg-gray-100">
      <iframe
        src={url}
        className="w-full h-[70vh]"
        title={title || 'PDF Document'}
        style={{ border: 'none' }}
      />
    </div>
  );
}
