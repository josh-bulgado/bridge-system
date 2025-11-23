import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  url: string;
  title?: string;
  onDownload?: () => void;
}

/**
 * 🔒 Image Viewer with Zoom Controls
 * - Zoom in/out functionality
 * - Rotate image
 * - Fit to screen
 * - Download option
 */
export function ImageViewer({ url, title, onDownload }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitToScreen = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 border-b bg-muted/30">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 25}
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 400}
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            title="Rotate 90°"
          >
            <RotateCw className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            title="Fit to Screen"
          >
            <Maximize2 className="size-4" />
          </Button>
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              title="Download"
            >
              <Download className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-full p-4">
          <img
            src={url}
            alt={title || 'Document'}
            className={cn(
              "transition-transform duration-200 ease-in-out",
              "max-w-none"
            )}
            style={{
              width: `${zoom}%`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
