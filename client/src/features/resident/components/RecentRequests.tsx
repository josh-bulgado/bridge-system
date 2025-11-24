import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, FileText } from "lucide-react";
import { RequestItem, type RequestData } from "./RequestItem";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentRequestsProps {
  isVerified: boolean;
  requests: RequestData[];
  isLoading?: boolean;
  onRequestClick?: (request: RequestData) => void;
}

export const RecentRequests: React.FC<RecentRequestsProps> = ({
  isVerified,
  requests,
  isLoading = false,
  onRequestClick,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
        <CardDescription>
          {isVerified
            ? "Your latest submitted requests and their status"
            : "Verify your residency to view your requests"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isVerified ? (
          <div className="py-8 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="mb-2 text-gray-500">Requests are locked</p>
            <p className="text-sm text-gray-400">
              Please verify your residency to access your request history
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="mb-2 text-gray-500">No requests yet</p>
            <p className="text-sm text-gray-400">
              Start by submitting your first document request
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                onViewClick={onRequestClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
