import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

export const ForgotPasswordPage = () => {
  return (
    <div className="relative flex h-svh w-svw items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      {/* Theme Switcher - Top Right */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeSwitcherMultiButton />
      </div>

      {/* Floating Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Bridge Icon */}
        <div className="mb-6 flex justify-center">
          <BridgeIcon />
        </div>

        {/* Floating Card with Shadow */}
        <div className="rounded-lg border bg-card p-6 shadow-2xl md:p-8">
          <div className="mb-6 flex flex-col space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />

          {/* Back to Sign In */}
          <div className="mt-6 text-center border-t pt-6">
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-primary hover:underline underline-offset-4 transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
