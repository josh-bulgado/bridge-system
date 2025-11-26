import { useAuth } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";

interface VerificationStatusSectionProps {
  onClose?: () => void;
}

export function VerificationStatusSection({ onClose }: VerificationStatusSectionProps) {
  const { data: user } = useAuth();
  const { data: verificationData } = useVerificationStatus();
  const navigate = useNavigate();

  const handleNavigateToVerification = () => {
    navigate("/resident/verification");
    onClose?.();
  };

  const isVerified = verificationData?.isVerified ?? false;
  const verificationStatus = verificationData?.status || "Not Submitted";
  const submittedDocuments = verificationData?.documents || [];
  const rejectionReason = verificationData?.rejectionReason;

  const getStatusIcon = () => {
    if (isVerified || verificationStatus === "Approved") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (verificationStatus === "Pending" || verificationStatus === "Under Review") {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
    if (verificationStatus === "Rejected") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusBadge = () => {
    if (isVerified || verificationStatus === "Approved") {
      return <Badge className="bg-green-500">Verified</Badge>;
    }
    if (verificationStatus === "Pending" || verificationStatus === "Under Review") {
      return <Badge className="bg-yellow-500">Pending Review</Badge>;
    }
    if (verificationStatus === "Rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return <Badge variant="secondary">Not Verified</Badge>;
  };

  const getStatusDescription = () => {
    if (isVerified || verificationStatus === "Approved") {
      return "Your account has been verified. You have full access to all resident services.";
    }
    if (verificationStatus === "Pending" || verificationStatus === "Under Review") {
      return "Your verification documents are currently under review. This process typically takes 1-3 business days.";
    }
    if (verificationStatus === "Rejected") {
      return "Your verification was rejected. Please review the feedback and resubmit your documents.";
    }
    return "You need to verify your account to access all resident services. Please submit the required documents.";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Verification Status</h3>
        <p className="text-sm text-muted-foreground mt-1">
          View your account verification status and submitted documents
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon()}
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1">Account Verification</h4>
              <p className="text-xs text-muted-foreground">
                {getStatusDescription()}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Display Rejection Reason if status is rejected */}
        {verificationStatus === "Rejected" && rejectionReason && (
          <div className="mt-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3">
            <p className="text-xs font-medium text-red-900 dark:text-red-200 mb-1">
              Reason for Rejection:
            </p>
            <p className="text-xs text-red-800 dark:text-red-300">
              {rejectionReason}
            </p>
          </div>
        )}
        
        {(!isVerified && verificationStatus !== "Pending" && verificationStatus !== "Under Review") && (
          <Button
            onClick={handleNavigateToVerification}
            className="w-full mt-3"
            size="sm"
          >
            {verificationStatus === "Rejected" ? "Resubmit Documents" : "Start Verification"}
          </Button>
        )}
      </div>

      {/* Submitted Documents */}
      {submittedDocuments.length > 0 && (
        <div className="rounded-lg border p-4">
          <h4 className="text-sm font-medium mb-3">Submitted Documents</h4>
          <div className="space-y-2">
            {submittedDocuments.map((doc: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{doc.type || "Document"}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.uploadedAt
                        ? new Date(doc.uploadedAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
                {doc.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Documents Info */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-3">Required Documents</h4>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            Valid Government-issued ID (e.g., National ID, Passport, Driver's License)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            Proof of Residency (e.g., Utility Bill, Barangay Certificate)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            Recent ID Photo (2x2 or passport-sized)
          </li>
        </ul>
      </div>
    </div>
  );
}
