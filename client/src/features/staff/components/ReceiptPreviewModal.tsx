import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";

import type { PaymentRecord } from "../types/payment";

interface ReceiptPreviewModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!payment) return;
    
    const link = document.createElement('a');
    link.href = payment.receiptUrl;
    link.download = `receipt-${payment.paymentId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setZoom(100);
    setRotation(0);
    onClose();
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                GCash Receipt Preview
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Payment ID: {payment.paymentId} • {payment.requesterName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Controls */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="h-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium min-w-16 text-center">
              {zoom}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="h-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px h-4 bg-gray-300 mx-2" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-8"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <div className="w-px h-4 bg-gray-300 mx-2" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto bg-gray-50 mx-6 mb-6 rounded-lg border">
          <div className="min-h-full flex items-center justify-center p-4">
            <div 
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <img
                src={payment.receiptUrl}
                alt="GCash Receipt"
                className="max-w-none shadow-lg rounded-lg"
                style={{
                  maxHeight: rotation % 180 === 0 ? '70vh' : '50vw',
                  width: 'auto',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgMjY2LjY2N0gyMzBWMzMzLjMzM0gxNzBWMjY2LjY2N1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
                }}
              />
            </div>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amount
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(payment.amount)}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Method
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {payment.paymentMethod}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Reference
              </p>
              <p className="text-sm font-mono text-gray-900">
                {payment.referenceNumber || 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Submitted
              </p>
              <p className="text-sm text-gray-900">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(payment.submittedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};