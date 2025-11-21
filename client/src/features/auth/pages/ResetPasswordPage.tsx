import { Link } from "react-router-dom";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

export const ResetPasswordPage = () => {
  return (
    <div className="relative flex h-svh w-svw items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
      
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
          <ResetPasswordForm />
          
          {/* Footer inside card */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;
