import { Link } from "react-router-dom";
import { useOtpVerificationFlow } from "../hooks/useOtpVerificationFlow";
import { OtpInputField } from "./OtpInputField";
import { OtpTimer } from "./OtpTimer";
import { OtpSuccessView } from "./OtpSuccessView";
import { OtpErrorMessage } from "./OtpErrorMessage";

interface VerifyOTPFormProps {
  email: string;
}

export const VerifyOTPForm_New = ({ email }: VerifyOTPFormProps) => {
  const {
    // OTP Input
    code,
    inputRefs,
    handleInputChange,
    handleInput,
    handleKeyDown,
    handlePaste,

    // Timer
    timeRemaining,
    isExpired,
    formatTime,

    // Verification
    handleVerify,
    isVerifying,
    isSuccess,

    // Resend
    handleResend,
    isResending,
    resendCooldown,

    // Error handling
    errorMessage,
    attempts,
    maxAttempts,

    // Computed states
    canVerify,
    canResend,
  } = useOtpVerificationFlow({ email });

  return (
    <>
      <div className="bg-card flex w-full max-w-md flex-col gap-6 rounded-lg border p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center">
          <h2 className="text-2xl leading-none font-semibold tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter the 6-digit code we sent to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>

        {/* Success Animation */}
        {isSuccess && <OtpSuccessView />}

        {/* OTP Input Form */}
        {!isSuccess && (
          <>
            {/* OTP Input Fields */}
            <div className="space-y-3">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <OtpInputField
                    key={index}
                    value={code[index]}
                    index={index}
                    onChange={handleInputChange}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    disabled={isVerifying}
                    hasError={errorMessage?.includes("Invalid") || isExpired}
                    isSuccess={isSuccess}
                  />
                ))}
              </div>
            </div>

            {/* Timer Component */}
            <OtpTimer
              timeRemaining={timeRemaining}
              formatTime={formatTime}
              isExpired={isExpired}
            />

            {/* Error Message Component */}
            {errorMessage && !isExpired && (
              <OtpErrorMessage
                error={errorMessage}
                attempts={attempts}
                maxAttempts={maxAttempts}
              />
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!canVerify}
              className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend Section */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-sm">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="text-primary inline-flex items-center justify-center text-sm font-medium underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
              </button>
            </div>

            {/* Back Link */}
            <div className="border-t pt-4 text-center">
              <Link
                to="/sign-in"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </>
  );
};
