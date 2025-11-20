import { useVerification } from "../hooks/useVerification";
import { useFileUpload } from "../hooks/useFileUpload";
import { VerificationHeader } from "../components/VerificationHeader";
import { VerificationForm } from "../components/VerificationForm";
import { VerificationSuccessScreen } from "../components/VerificationSuccessScreen";

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
      <VerificationSuccessScreen onBackToDashboard={handleBackToDashboard} />
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
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
  );
};

export default VerificationPage;
