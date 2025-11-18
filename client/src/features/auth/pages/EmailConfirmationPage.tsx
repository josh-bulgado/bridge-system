import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

interface LocationState {
  email?: string;
  message?: string;
}

export const EmailConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const email = state?.email;

  // Redirect to sign-in if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/sign-in");
    }
  }, [email, navigate]);

  const handleVerifyEmail = () => {
    if (!email) return;

    // Don't resend OTP - it was already sent during registration
    // Just redirect to OTP verification page
    navigate("/verify-otp", {
      state: {
        email: email,
        message: "Enter the 6-digit code we sent to your email.",
      },
    });
  };

  if (!email) return null;

  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center p-4 gap-6">
      <ThemeSwitcherMultiButton />
      <BridgeIcon />

      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            {state?.message || (
              <>
                You have entered <span className="font-medium text-foreground">{email}</span> as the email address for your account. To verify your email, we will send a verification code to this address.
              </>
            )}
          </p>
        </div>

        {/* Warning Alert */}
        <div className="rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Verify within 3 days
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Your account will be automatically deleted if not verified within 3 days to keep our database clean.
              </p>
            </div>
          </div>
        </div>

        {/* Email Display Card */}
        <div className="rounded-md border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="text-sm font-medium truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyEmail}
          className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Continue to Verification
        </button>

        {/* Back Link */}
        <div className="text-center border-t pt-4">
          <button
            onClick={() => navigate("/sign-in")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
