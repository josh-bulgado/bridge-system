import { useParams, useNavigate } from "react-router-dom";
import { useFetchDocumentRequestById } from "@/features/document/hooks/useFetchDocumentRequestById";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  MapPin,
  User,
  Hash,
  PhilippinePeso,
} from "lucide-react";
import { RequestStatusStepper } from "../components/RequestStatusStepper";
import { RequestStatusTimeline } from "../components/RequestStatusTimeline";
import { CancelRequestDialog } from "../components/CancelRequestDialog";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-slate-500",
  approved: "bg-blue-500",
  payment_pending: "bg-blue-500",
  payment_verified: "bg-sky-500",
  ready_for_generation: "bg-purple-500",
  processing: "bg-indigo-500",
  ready_for_pickup: "bg-cyan-500",
  completed: "bg-emerald-600",
  cancelled: "bg-orange-500",
  rejected: "bg-red-500",
};

export default function DocumentRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: request, isLoading, error } = useFetchDocumentRequestById(id!);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Handle back navigation - goes to previous page or fallback to requests list
  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Go back to previous page
    } else {
      // Fallback to requests list if no history
      navigate("/resident/requests");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <FileText className="text-muted-foreground mx-auto h-12 w-12" />
              <h2 className="text-xl font-semibold">Request Not Found</h2>
              <p className="text-muted-foreground">
                The document request you're looking for doesn't exist or you
                don't have permission to view it.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancel = ["pending", "payment_pending"].includes(request.status);

  const handleCancelSuccess = () => {
    // After cancellation, go back to where they came from
    handleBack();
  };

  return (
    <div className="container space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Request Details</h1>
          <p className="text-muted-foreground">
            Track your document request status and details
          </p>
        </div>
        <Badge
          className={cn(
            "text-white capitalize",
            statusColors[request.status] || "bg-gray-500",
          )}
        >
          {request.status}
        </Badge>
      </div>

      {/* Status Stepper */}
      <Card className="hidden md:flex">
        <CardHeader>
          <CardTitle>Request Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestStatusStepper currentStatus={request.status} />
        </CardContent>
      </Card>

      {/* Request Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Tracking Number
                  </p>
                  <p className="font-mono font-semibold">
                    {request.trackingNumber}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <FileText className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">Document Type</p>
                  <p className="font-medium">{request.documentType}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">Purpose</p>
                  <p className="font-medium">
                    {request.purpose.replace(/\b\w/g, (char) =>
                      char.toUpperCase(),
                    )}
                  </p>
                </div>
              </div>

              {request.additionalDetails && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm">
                        Additional Details
                      </p>
                      <p className="text-sm">{request.additionalDetails}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">Submitted On</p>
                  <p className="font-medium">
                    {format(
                      new Date(request.createdAt),
                      "MMMM dd, yyyy 'at' h:mm a",
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <PhilippinePeso className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">Amount</p>
                  <p className="text-lg font-semibold">
                    ₱{request.amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Payment Method
                  </p>
                  <p className="font-medium capitalize">
                    {request.paymentMethod}
                  </p>
                </div>
              </div>

              {request.paymentReferenceNumber && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Hash className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm">
                        Reference Number
                      </p>
                      <p className="font-mono text-sm">
                        {request.paymentReferenceNumber}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {request.paymentProof && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      Payment Proof
                    </p>
                    <a
                      href={request.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      View Payment Receipt
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardContent className="pt-6">
              <RequestStatusTimeline
                currentStatus={request.status}
                createdAt={request.createdAt}
                updatedAt={request.updatedAt}
                statusHistory={request.statusHistory}
              />
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          {request.supportingDocuments &&
            request.supportingDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.supportingDocuments.map(
                      (doc: string, index: number) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:bg-muted flex items-center gap-2 rounded-lg border p-3 transition-colors"
                        >
                          <FileText className="text-muted-foreground h-5 w-5" />
                          <span className="flex-1 text-sm">
                            Document {index + 1}
                          </span>
                          <Download className="text-muted-foreground h-4 w-4" />
                        </a>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Actions */}
      {canCancel && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            className="w-full sm:w-auto"
          >
            Cancel Request
          </Button>
        </div>
      )}

      {/* Cancel Dialog */}
      <CancelRequestDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        requestId={request.id}
        trackingNumber={request.trackingNumber}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}
