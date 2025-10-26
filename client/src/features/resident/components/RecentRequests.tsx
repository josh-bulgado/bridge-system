import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { RequestItem, type RequestData } from "./RequestItem";

interface RecentRequestsProps {
  isVerified: boolean;
  requests: RequestData[];
  onRequestClick?: (request: RequestData) => void;
}

export const RecentRequests: React.FC<RecentRequestsProps> = ({
  isVerified,
  requests,
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
