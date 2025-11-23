import { useAuth } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerificationStatusSectionProps {
  onClose?: () => void;
}

export function VerificationStatusSection({ onClose }: VerificationStatusSectionProps) {
  const { data: user } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToVerification = () => {
    navigate("/resident/verification");
    onClose?.();
  };

  const verificationStatus = user?.resident?.verificationStatus || "unverified";
  const submittedDocuments = user?.resident?.documents || [];

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Verified</Badge>;
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case "verified":
        return "Your account has been verified. You have full access to all resident services.";
      case "pending":
        return "Your verification documents are currently under review. This process typically takes 1-3 business days.";
      case "rejected":
        return "Your verification was rejected. Please review the feedback and resubmit your documents.";
      default:
        return "You need to verify your account to access all resident services. Please submit the required documents.";
    }
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
        {(verificationStatus === "unverified" || verificationStatus === "rejected") && (
          <Button
            onClick={handleNavigateToVerification}
            className="w-full"
            size="sm"
          >
            {verificationStatus === "rejected" ? "Resubmit Documents" : "Start Verification"}
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
