import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Check, 
  X, 
  Eye, 
  Clock,
  CreditCard,
  User,
  Hash,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentRecord } from "../types/payment";

interface PaymentCardProps {
  payment: PaymentRecord;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
  className?: string;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onApprove,
  onReject,
  onViewReceipt,
  isSelected = false,
  onSelect,
  showSelection = false,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove(payment.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject(payment.id);
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = payment.status === 'pending_verification';

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-lg border border-gray-200",
      isSelected && "ring-2 ring-blue-500 border-blue-300",
      className
    )}>
      <CardContent className="p-6">
        {/* Header with selection and document type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {showSelection && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect?.(payment.id, !!checked)}
                className="mt-1"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {payment.documentType}
              </h3>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Pending Verification
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(payment.amount)}
            </div>
            <div className="text-xs text-gray-500">
              {getTimeAgo(payment.submittedAt)}
            </div>
          </div>
        </div>

        {/* Main content - two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left column - Payment details (70%) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Payment ID
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {payment.paymentId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Request ID
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {payment.requestId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Requester
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.requesterName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Payment Method
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {payment.paymentMethod}
                      </p>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Digital Wallet
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Submitted
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(payment.submittedAt)}
                    </p>
                  </div>
                </div>

                {payment.referenceNumber && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Reference Number
                      </p>
                      <p className="text-sm font-mono text-gray-900">
                        {payment.referenceNumber}
                      </p>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Validated
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Receipt preview (30%) */}
          <div className="lg:col-span-3">
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                GCash Receipt
              </p>
              
              <div className="relative">
                <div 
                  className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => onViewReceipt(payment)}
                >
                  <img
                    src={payment.receiptUrl}
                    alt="GCash Receipt"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDEzMy4zMzNIMTE0LjY2N1YxNjYuNjY3SDg1LjMzMzNWMTMzLjMzM1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
                    }}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewReceipt(payment)}
                  className="w-full mt-2 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Full Size
                </Button>
              </div>

              {payment.referenceNumber && (
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Reference Validated
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="h-13 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Verified in GCash - Approve
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isLoading}
              className="h-13 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Invalid - Reject
            </Button>
          </div>
        )}

        {payment.status === 'verified' && (
          <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Verified on {formatDateTime(payment.verifiedAt!)}
                {payment.verifiedBy && ` by ${payment.verifiedBy}`}
              </span>
            </div>
          </div>
        )}

        {payment.status === 'rejected' && (
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Rejected: {payment.rejectionReason}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};