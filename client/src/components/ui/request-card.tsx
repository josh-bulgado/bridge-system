import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  FileText, 
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: {
    id: string;
    trackingNumber: string;
    documentType: string;
    residentName: string;
    purpose: string;
    amount: number;
    status: 'pending' | 'approved' | 'payment_pending' | 'ready_for_generation';
    submittedAt: Date;
    paymentStatus?: 'paid' | 'unpaid';
  };
  onViewDetails: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Check,
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CreditCard,
  },
  ready_for_generation: {
    label: "Ready for Generation",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FileText,
  },
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onViewDetails,
  onApprove,
  onReject,
  className,
}) => {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Check if actions should be shown
  const showApproveReject = request.status === 'pending' && onApprove && onReject;
  const isPaid = request.paymentStatus === 'paid';

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 border border-gray-200",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
          {/* Left Column - Main Information */}
          <div className="flex-1 min-w-0">
            {/* Header with Document Type and Status */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {request.documentType}
              </h3>
              <div className="flex items-center gap-2">
                {isPaid && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    PAID
                  </Badge>
                )}
                <Badge className={cn("border", status.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tracking Number
                </p>
                <p className="text-sm font-mono text-gray-900 mt-1">
                  {request.trackingNumber}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Resident
                </p>
                <p className="text-sm text-gray-900 mt-1 font-medium">
                  {request.residentName}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Purpose
                </p>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {request.purpose}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </p>
                <p className="text-sm font-bold text-green-600 mt-1">
                  {formatAmount(request.amount)}
                </p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Submitted {getRelativeTime(request.submittedAt)}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="flex flex-col justify-between lg:min-w-[200px]">
            <div className="flex flex-col space-y-3">
              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(request.id)}
                className="flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              {/* Conditional Action Buttons */}
              {showApproveReject && (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove!(request.id)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject!(request.id)}
                    className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex-1"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Priority Indicator for Urgent Requests */}
            {request.status === 'pending' && (
              <div className="mt-3 lg:mt-0">
                <div className="text-xs text-orange-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
                  Needs Review
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};