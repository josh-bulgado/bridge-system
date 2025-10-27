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
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestCardCompactProps {
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
  onClick?: (id: string) => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
    dot: "bg-orange-500",
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Check,
    dot: "bg-blue-500",
  },
  payment_pending: {
    label: "Payment",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CreditCard,
    dot: "bg-purple-500",
  },
  ready_for_generation: {
    label: "Ready",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FileText,
    dot: "bg-blue-500",
  },
};

export const RequestCardCompact: React.FC<RequestCardCompactProps> = ({
  request,
  onViewDetails,
  onApprove,
  onReject,
  onClick,
  className,
}) => {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  // Format relative time (shorter format)
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  // Format currency (shorter)
  const formatAmount = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const showApproveReject = request.status === 'pending' && onApprove && onReject;
  const isPaid = request.paymentStatus === 'paid';
  const isClickable = Boolean(onClick);

  return (
    <Card 
      className={cn(
        "group transition-all duration-200 hover:shadow-md border border-gray-200",
        isClickable && "cursor-pointer hover:border-gray-300",
        className
      )}
      onClick={() => onClick?.(request.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Main info */}
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-2 h-2 rounded-full", status.dot)} />
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {request.documentType}
              </h4>
              {isPaid && (
                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
              )}
            </div>
            
            <p className="text-xs text-gray-600 truncate mb-1">
              {request.residentName} • {request.trackingNumber}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600">
                {formatAmount(request.amount)}
              </span>
              <span className="text-xs text-gray-500">
                {getRelativeTime(request.submittedAt)}
              </span>
            </div>
          </div>

          {/* Right side - Status and actions */}
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", status.color)}>
              <StatusIcon className="h-2.5 w-2.5 mr-1" />
              {status.label}
            </Badge>

            {/* Quick actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {showApproveReject ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove!(request.id);
                    }}
                    className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject!(request.id);
                    }}
                    className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(request.id);
                  }}
                  className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-50"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-50"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};