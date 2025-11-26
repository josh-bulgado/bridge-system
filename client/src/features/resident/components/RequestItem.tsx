import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface RequestData {
  id: string;
  type: string;
  status: string;
  date: string;
  statusColor: string;
  trackingNumber?: string;
}

interface RequestItemProps {
  request: RequestData;
  onViewClick?: (request: RequestData) => void;
}

export const RequestItem: React.FC<RequestItemProps> = ({
  request,
  onViewClick,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium text-gray-900">
              {request.type}
            </p>
            <p className="text-sm text-gray-500">
              Request ID: {request.id}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${request.statusColor}`}
          >
            {request.status}
          </span>
          <p className="mt-1 text-xs text-gray-500">{request.date}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewClick?.(request)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};