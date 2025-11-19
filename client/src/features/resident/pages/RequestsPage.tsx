import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentRequests } from "../hooks/useDocumentRequests";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Search, Plus, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Action Required": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Ready for Pickup": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const RequestsPage = () => {
  const navigate = useNavigate();
  const { requests, isLoading } = useDocumentRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch =
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/resident")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Requests</h1>
            <p className="mt-1 text-gray-600">
              View and manage your document requests
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/resident/new-request")}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by request number, document type, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Action Required">Action Required</SelectItem>
                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {filteredRequests && filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="mb-2 text-lg font-semibold text-gray-600">
              No requests found
            </p>
            <p className="mb-4 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first request"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => navigate("/resident/new-request")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests?.map((request) => (
            <Card
              key={request.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/resident/requests/${request.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {request.documentType}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {request.requestNumber}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Purpose:</span>{" "}
                    {request.purpose}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {request.paymentRequired && (
                      <div>
                        <span className="font-semibold">Amount:</span> ₱
                        {request.paymentAmount?.toFixed(2)}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Quantity:</span>{" "}
                      {request.quantity}
                    </div>
                  </div>
                  {request.pickupSchedule && (
                    <p className="text-sm text-green-600">
                      <span className="font-semibold">Pickup Schedule:</span>{" "}
                      {format(new Date(request.pickupSchedule), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
