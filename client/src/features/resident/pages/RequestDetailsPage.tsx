import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import documentRequestService from "../services/documentRequestService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, FileText, Clock, DollarSign, Package, AlertCircle } from "lucide-react";
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

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading } = useQuery({
    queryKey: ["documentRequest", id],
    queryFn: () => documentRequestService.getRequestById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300" />
            <p className="mb-2 text-lg font-semibold text-gray-600">
              Request not found
            </p>
            <Button onClick={() => navigate("/resident/requests")}>
              Back to Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/resident/requests")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Request Details</h1>
          <p className="mt-1 text-gray-600">{request.requestNumber}</p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status</CardTitle>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {request.status === "Rejected" && request.rejectionReason && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="font-semibold text-red-800 dark:text-red-400">
                Rejection Reason:
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {request.rejectionReason}
              </p>
            </div>
          )}
          {request.status === "Ready for Pickup" && request.pickupSchedule && (
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <p className="font-semibold text-green-800 dark:text-green-400">
                Pickup Schedule:
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                {format(new Date(request.pickupSchedule), "MMMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Document Type</p>
            <p className="text-lg">{request.documentType}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-semibold text-gray-600">Purpose</p>
            <p className="mt-1">{request.purpose}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Quantity</p>
              <p>{request.quantity}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Requested On</p>
              <p>{format(new Date(request.createdAt), "MMM dd, yyyy")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {request.paymentRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Amount</p>
                <p className="text-lg">₱{request.paymentAmount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Payment Status
                </p>
                <Badge
                  className={
                    request.paymentStatus === "Verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {request.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Documents */}
      {request.requiredDocuments && request.requiredDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Required Documents
            </CardTitle>
            <CardDescription>
              Please prepare these documents for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              {request.requiredDocuments.map((doc, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {doc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {request.statusHistory && request.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.statusHistory.map((history, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(history.status)}>
                        {history.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(history.changedAt), "MMM dd, yyyy h:mm a")}
                      </span>
                    </div>
                    {history.comment && (
                      <p className="mt-1 text-sm text-gray-600">
                        {history.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestDetailsPage;
