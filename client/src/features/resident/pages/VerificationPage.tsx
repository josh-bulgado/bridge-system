import { useVerification } from "../hooks/useVerification";
import { useFileUpload } from "../hooks/useFileUpload";
import { VerificationHeader } from "../components/VerificationHeader";
import { VerificationForm } from "../components/VerificationForm";
import { VerificationSuccessScreen } from "../components/VerificationSuccessScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const VerificationPage = () => {
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

  // Show success screen if submitted
  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <VerificationSuccessScreen />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 py-4 lg:px-6">
          <div className="mx-auto max-w-2xl">
            <VerificationHeader onBack={handleBackToDashboard} />

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
              onRemoveIdBack={(onChange) => removeFile(setUploadedIdBack, onChange)}
              onRemoveProof={(onChange) => removeFile(setUploadedProof, onChange)}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default VerificationPage;
