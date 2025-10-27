import React from "react";
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

interface RequestCardListProps {
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
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
    textColor: "text-orange-600",
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Check,
    textColor: "text-blue-600",
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CreditCard,
    textColor: "text-purple-600",
  },
  ready_for_generation: {
    label: "Ready for Generation",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FileText,
    textColor: "text-blue-600",
  },
};

export const RequestCardList: React.FC<RequestCardListProps> = ({
  request,
  onViewDetails,
  onApprove,
  onReject,
  onClick,
  isSelected = false,
  onSelect,
  className,
}) => {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const showApproveReject = request.status === 'pending' && onApprove && onReject;
  const isPaid = request.paymentStatus === 'paid';
  const isClickable = Boolean(onClick);

  return (
    <div 
      className={cn(
        "group flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isSelected && "bg-blue-50 border-blue-200",
        isClickable && "cursor-pointer",
        className
      )}
      onClick={() => onClick?.(request.id)}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(request.id, e.target.checked);
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      )}

      {/* Document Type & Status */}
      <div className="flex-shrink-0 w-48">
        <div className="flex items-center gap-2 mb-1">
          <StatusIcon className={cn("h-4 w-4", status.textColor)} />
          <span className="font-medium text-gray-900 text-sm">
            {request.documentType}
          </span>
        </div>
        <Badge className={cn("text-xs", status.color)}>
          {status.label}
        </Badge>
      </div>

      {/* Tracking Number */}
      <div className="flex-shrink-0 w-32">
        <p className="text-xs text-gray-500 uppercase font-mono">
          {request.trackingNumber}
        </p>
      </div>

      {/* Resident Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {request.residentName}
        </p>
        <p className="text-xs text-gray-600 truncate">
          {request.purpose}
        </p>
      </div>

      {/* Amount & Payment */}
      <div className="flex-shrink-0 w-24 text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="font-semibold text-green-600 text-sm">
            {formatAmount(request.amount)}
          </span>
          {isPaid && (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          )}
        </div>
      </div>

      {/* Date */}
      <div className="flex-shrink-0 w-20">
        <p className="text-xs text-gray-500">
          {formatDate(request.submittedAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 w-32">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(request.id);
            }}
            className="h-7 px-2 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>

          {showApproveReject && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove!(request.id);
                }}
                className="h-7 px-2 text-xs text-green-600 hover:bg-green-50"
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
                className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-100"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};