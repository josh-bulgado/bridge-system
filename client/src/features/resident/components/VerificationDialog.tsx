import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVerification } from "../hooks/useVerification";
import { useFileUpload } from "../hooks/useFileUpload";
import { VerificationForm } from "./VerificationForm";
import { VerificationSuccessScreen } from "./VerificationSuccessScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationSuccess?: () => void;
}

export const VerificationDialog = ({
  open,
  onOpenChange,
  onVerificationSuccess,
}: VerificationDialogProps) => {
  const { form, isSubmitted, isSubmitting, onSubmit, handleBackToDashboard } =
    useVerification();

  const {
    uploadedIdFront,
    uploadedIdBack,
    uploadedProof,
    uploadingIdFront,
    uploadingIdBack,
    uploadingProof,
    setUploadedIdFront,
    setUploadedIdBack,
    setUploadedProof,
    setUploadingIdFront,
    setUploadingIdBack,
    setUploadingProof,
    handleFileUpload,
    removeFile,
  } = useFileUpload();

  // Handle success and close dialog
  const handleSuccess = () => {
    handleBackToDashboard();
    onOpenChange(false);
    if (onVerificationSuccess) {
      onVerificationSuccess();
    }
    // Clear files only after successful submission
    setUploadedIdFront(null);
    setUploadedIdBack(null);
    setUploadedProof(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {isSubmitted ? (
              <VerificationSuccessScreen onBackToDashboard={handleSuccess} />
            ) : (
              <>
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl">
                    Verify Your Residency
                  </DialogTitle>
                  <DialogDescription>
                    Please provide your address details and upload required
                    documents to verify your residency.
                  </DialogDescription>
                </DialogHeader>

                <VerificationForm
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  uploadedIdFront={uploadedIdFront}
                  uploadedIdBack={uploadedIdBack}
                  uploadedProof={uploadedProof}
                  uploadingIdFront={uploadingIdFront}
                  uploadingIdBack={uploadingIdBack}
                  uploadingProof={uploadingProof}
                  onUploadIdFront={(file, onChange) =>
                    handleFileUpload(
                      file,
                      setUploadedIdFront,
                      setUploadingIdFront,
                      onChange
                    )
                  }
                  onUploadIdBack={(file, onChange) =>
                    handleFileUpload(
                      file,
                      setUploadedIdBack,
                      setUploadingIdBack,
                      onChange
                    )
                  }
                  onUploadProof={(file, onChange) =>
                    handleFileUpload(
                      file,
                      setUploadedProof,
                      setUploadingProof,
                      onChange
                    )
                  }
                  onRemoveIdFront={(onChange) =>
                    removeFile(setUploadedIdFront, onChange)
                  }
                  onRemoveIdBack={(onChange) =>
                    removeFile(setUploadedIdBack, onChange)
                  }
                  onRemoveProof={(onChange) =>
                    removeFile(setUploadedProof, onChange)
                  }
                />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
