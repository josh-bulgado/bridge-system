import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import {
  FileText,
  Clock,
  Package,
  Check,
  Plus,
  Eye,
  ShieldCheck,
  X,
  Lock,
} from "lucide-react";

const ResidentDashboard = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationReminder, setShowVerificationReminder] =
    useState(!isVerified);

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: "Total Requests",
      count: 12,
      description: "All submitted requests",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Action Required",
      count: 3,
      description: "Requests needing your action",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Ready for Pickup",
      count: 2,
      description: "Documents ready to collect",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed",
      count: 7,
      description: "Successfully processed",
      icon: Check,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  // Mock recent requests data
  const recentRequests = [
    {
      id: "REQ-2024-001",
      type: "Barangay Clearance",
      status: "Ready for Pickup",
      date: "2024-01-15",
      statusColor: "text-green-600 bg-green-50",
    },
    {
      id: "REQ-2024-002",
      type: "Certificate of Residency",
      status: "Action Required",
      date: "2024-01-14",
      statusColor: "text-orange-600 bg-orange-50",
    },
    {
      id: "REQ-2024-003",
      type: "Business Permit",
      status: "Processing",
      date: "2024-01-13",
      statusColor: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Verification Reminder */}
      {showVerificationReminder && (
        <Item
          variant="outline"
          className="border-l-4 border-orange-200 border-l-orange-500 bg-orange-50"
        >
          <ItemMedia variant="icon" className="border-orange-200 bg-orange-100">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-orange-800">
              Verify Your Residency
            </ItemTitle>
            <ItemDescription className="text-orange-700">
              Please verify your residency to access all barangay services and
              submit requests. Verification ensures you're a legitimate resident
              of this barangay.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="sm"
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              Verify Now
            </Button>
          </ItemActions>
        </Item>
      )}

      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Resident!
        </h1>
        <p className="mt-2 text-gray-600">
          Track your requests and manage your barangay services
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const isLocked = !isVerified;
          return (
            <Card
              key={index}
              className={`transition-shadow ${
                isLocked 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-md'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {isLocked ? '--' : stat.count}
                    </p>
                    <p className={`mt-1 text-xs ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                      {isLocked ? 'Verification required' : stat.description}
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${isLocked ? 'bg-gray-100' : stat.bgColor}`}>
                    {isLocked ? (
                      <Lock className="h-6 w-6 text-gray-400" />
                    ) : (
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
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
            >
              {!isVerified ? <Lock className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              New Request
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!isVerified}
            >
              {!isVerified ? <Lock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              View All Requests
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!isVerified}
            >
              {!isVerified ? <Lock className="h-4 w-4" /> : <Package className="h-4 w-4" />}
              Pickup Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            {isVerified 
              ? "Your latest submitted requests and their status" 
              : "Verify your residency to view your requests"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isVerified ? (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Requests are locked</p>
              <p className="text-sm text-gray-400">Please verify your residency to access your request history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
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
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDashboard;
