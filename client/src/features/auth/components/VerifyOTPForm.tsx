/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import {
  OTPInput,
  OTPTimer,
  OTPSuccessAnimation,
  OTPErrorMessage,
  OTPResendSection,
  OTPHeader,
} from "./otp";

// TypeScript Interfaces
interface VerifyOTPFormProps {
  email?: string;
}

interface OTPState {
  code: string[];
  timeRemaining: number;
  attempts: number;
  isVerifying: boolean;
  error: string | null;
  success: boolean;
}

const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_SECONDS = 600; // 10 minutes
const RESEND_COOLDOWN_SECONDS = 60; // 1 minute

export const VerifyOTPForm = ({ email }: VerifyOTPFormProps) => {
  const navigate = useNavigate();

  // Guard: Redirect if no email provided
  if (!email) {
    return null;
  }

  // State management
  const [otpState, setOtpState] = useState<OTPState>({
    code: ["", "", "", "", "", ""],
    timeRemaining: OTP_EXPIRY_SECONDS,
    attempts: 0,
    isVerifying: false,
    error: null,
    success: false,
  });

  // Check if code is complete
  const isCodeComplete = otpState.code.every((digit) => digit !== "");

  // Check if code is expired
  const isCodeExpired = otpState.timeRemaining === 0;

  // Handle code change
  const handleCodeChange = (code: string[]) => {
    setOtpState((prev) => ({
      ...prev,
      code,
      error: null, // Clear error when user types
    }));
  };

  // Handle timer expiration
  const handleTimerExpire = () => {
    setOtpState((prev) => ({
      ...prev,
      error: "Code expired. Please request a new one.",
    }));
  };

  // Handle verify button click
  const handleVerify = async () => {
    if (!isCodeComplete || otpState.isVerifying || isCodeExpired) return;

    setOtpState((prev) => ({ ...prev, isVerifying: true, error: null }));

    try {
      const enteredCode = otpState.code.join("");
      const response = await authService.verifyEmail(email, enteredCode);

      // Success state
      setOtpState((prev) => ({
        ...prev,
        isVerifying: false,
        success: true,
        error: null,
      }));

      // Get user info from the response
      const user = response.user;

      // Redirect to appropriate dashboard based on user role
      setTimeout(() => {
        if (user && user.role) {
          if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "staff") {
            navigate("/staff");
          } else {
            navigate("/resident");
          }
        } else {
          // Fallback
          navigate("/sign-in", {
            state: {
              message:
                "Email verified successfully! Please sign in to continue.",
            },
          });
        }
      }, 2000);
    } catch (error: any) {
      // Error state
      const newAttempts = otpState.attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        setOtpState((prev) => ({
          ...prev,
          isVerifying: false,
          error: "🚫 Too many failed attempts. Please resend code.",
          attempts: newAttempts,
        }));
      } else {
        setOtpState((prev) => ({
          ...prev,
          isVerifying: false,
          error: `❌ ${error.message}`,
          attempts: newAttempts,
        }));

        // Trigger shake animation and clear inputs after 1 second
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach((input) => {
          input.classList.add("animate-shake");
        });

        setTimeout(() => {
          setOtpState((prev) => ({
            ...prev,
            code: ["", "", "", "", "", ""],
            error: prev.error, // Keep error message
          }));

          inputs.forEach((input) => {
            input.classList.remove("animate-shake");
          });
        }, 1000);
      }
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setOtpState((prev) => ({ ...prev, error: null }));

    try {
      await authService.resendOtp(email);

      setOtpState((prev) => ({
        ...prev,
        timeRemaining: OTP_EXPIRY_SECONDS,
        code: ["", "", "", "", "", ""],
        error: null,
        attempts: 0,
      }));

      // Show success message briefly
      setOtpState((prev) => ({
        ...prev,
        error: "✅ New code sent successfully! Check your email.",
      }));
      setTimeout(() => {
        setOtpState((prev) => ({ ...prev, error: null }));
      }, 3000);
    } catch (error: any) {
      setOtpState((prev) => ({
        ...prev,
        error: `❌ ${error.message}`,
      }));
    }
  };

  return (
    <>
      <div className="bg-card flex w-full max-w-md flex-col rounded-lg border p-6 shadow-lg sm:p-8">
        <OTPHeader />

        {/* Success Animation */}
        {otpState.success && <OTPSuccessAnimation />}

        {/* OTP Input and Verification */}
        {!otpState.success && (
          <>
            <div className="mb-6 sm:mb-8">
              <OTPInput
                value={otpState.code}
                onChange={handleCodeChange}
                disabled={otpState.isVerifying || otpState.success}
                error={
                  (otpState.error?.includes("Invalid") ?? false) ||
                  isCodeExpired
                }
                success={otpState.success}
              />
            </div>

            {/* Timer */}
            <div className="mb-4 sm:mb-6">
              <OTPTimer
                initialSeconds={otpState.timeRemaining}
                onExpire={handleTimerExpire}
                isActive={!otpState.success}
              />
            </div>

            {/* Error Message */}
            {otpState.error && !isCodeExpired && (
              <div className="mb-4 sm:mb-6">
                <OTPErrorMessage
                  message={otpState.error}
                  attempts={otpState.attempts}
                  maxAttempts={MAX_ATTEMPTS}
                  type={otpState.error.includes("✅") ? "success" : "error"}
                />
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={
                !isCodeComplete ||
                otpState.isVerifying ||
                isCodeExpired ||
                otpState.attempts >= MAX_ATTEMPTS
              }
              className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {otpState.isVerifying ? (
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

            {/* Resend Code */}
            <OTPResendSection
              onResend={handleResendCode}
              cooldownSeconds={RESEND_COOLDOWN_SECONDS}
              disabled={isCodeExpired}
            />

            {/* Back Link */}
            <div className="border-t pt-6 text-center">
              <Link
                to="/sign-in"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Custom Animations Styles */}
      <style>{`
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};
