import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Package, Lock } from "lucide-react";

interface QuickActionsProps {
  isVerified: boolean;
  onNewRequest?: () => void;
  onViewAllRequests?: () => void;
  onPickupSchedule?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isVerified,
  onNewRequest,
  onViewAllRequests,
  onPickupSchedule,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Start a new request or manage existing ones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="flex items-center gap-2" 
            disabled={!isVerified}
            onClick={onNewRequest}
          >
            {!isVerified && <Lock className="h-4 w-4" />}
            {isVerified && <Plus className="h-4 w-4" />}
            New Request
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!isVerified}
            onClick={onViewAllRequests}
          >
            {!isVerified && <Lock className="h-4 w-4" />}
            {isVerified && <Eye className="h-4 w-4" />}
            View All Requests
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!isVerified}
            onClick={onPickupSchedule}
          >
            {!isVerified && <Lock className="h-4 w-4" />}
            {isVerified && <Package className="h-4 w-4" />}
            Pickup Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};