import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, Clock } from "lucide-react";
import type { Request } from "../types";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: Request;
  onViewDetails?: (request: Request) => void;
  onApprove?: (request: Request) => void;
  onReject?: (request: Request) => void;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Check,
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Clock,
  },
  ready_for_generation: {
    label: "Ready for Generation",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Check,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Check,
  },
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onViewDetails,
  onApprove,
  onReject,
}) => {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const canApproveReject = request.status === 'pending';

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {request.documentType}
              </h3>
              <Badge className={cn("border", status.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">ID:</span> {request.trackingNumber}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Resident:</span> {request.residentName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ₱{request.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(request.submittedAt)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Purpose:</span> {request.purpose}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(request)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>

          {canApproveReject && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(request)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove?.(request)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};