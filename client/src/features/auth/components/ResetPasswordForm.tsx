/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "../services/authService";

// Schemas
const otpVerificationSchema = z.object({
  email: z.email(),
  otp: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

const passwordSetSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
type PasswordSetData = z.infer<typeof passwordSetSchema>;

export const ResetPasswordForm = () => {
  const [step, setStep] = useState<"verify-otp" | "set-password" | "success">(
    "verify-otp",
  );
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  // Get email from sessionStorage
  const emailFromStorage = sessionStorage.getItem("resetEmail") || "";

  // Redirect if no email found and trying to verify
  if (!emailFromStorage && step === "verify-otp") {
    navigate("/forgot-password");
    return null;
  }

  // Form 1: OTP Verification
  const otpForm = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: emailFromStorage,
      otp: "",
    },
  });

  // Form 2: Password Set
  const passwordForm = useForm<PasswordSetData>({
    resolver: zodResolver(passwordSetSchema),
    defaultValues: {
      newPassword: "",
    },
    mode: "onChange",
  });

  const onVerifyOtp = async (data: OtpVerificationData) => {
    try {
      await authService.verifyResetOtp(data.email, data.otp);
      setVerifiedOtp(data.otp);
      setStep("set-password");
      toast.success("Code verified!", {
        description: "Now set your new password.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Invalid or expired code";
      toast.error("Verification failed", {
        description: errorMessage,
      });
    }
  };

  const onSetPassword = async (data: PasswordSetData) => {
    try {
      await authService.resetPassword(
        emailFromStorage,
        verifiedOtp,
        data.newPassword,
      );
      setStep("success");
      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });
      sessionStorage.removeItem("resetEmail");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to reset password. Please try again.";

      // Check for password reuse warnings
      if (
        errorMessage.toLowerCase().includes("old password") ||
        errorMessage.toLowerCase().includes("previously used")
      ) {
        // Show as a warning toast
        toast.warning("Choose a different password", {
          description: errorMessage,
        });

        // Also set it as a form error on the input
        passwordForm.setError("newPassword", {
          type: "manual",
          message: errorMessage,
        });
        return;
      }

      toast.error("Failed to reset password", {
        description: errorMessage,
      });
    }
  };

  // Show button after 5 seconds on success page
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === "success") {
    return (
      <div className="grid gap-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Password Reset Successful!
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Redirecting you to sign in...
            </p>
          </div>
        </div>
        {showButton && (
          <Button asChild>
            <Link to="/sign-in">Go to Sign In</Link>
          </Button>
        )}
      </div>
    );
  }

  if (step === "verify-otp") {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          className="grid gap-6"
        >
          <div className="mb-4 flex flex-col gap-2 text-center">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Verify Your Code
            </h2>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Check your email for the 6-digit verification code. The code
              expires in 10 minutes.
            </AlertDescription>
          </Alert>

          {emailFromStorage && (
            <div className="bg-muted/50 rounded-md p-3 text-sm">
              <span className="text-muted-foreground">Code sent to: </span>
              <span className="font-medium">{emailFromStorage}</span>
            </div>
          )}

          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder=""
                    maxLength={6}
                    className="text-center text-3xl font-semibold tracking-widest"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                await authService.forgotPassword(emailFromStorage);
                toast.success("Code resent!", {
                  description: "Check your email for a new verification code.",
                });
              } catch (error: any) {
                toast.error("Failed to resend code", {
                  description: error.message || "Please try again.",
                });
              }
            }}
          >
            Resend Code
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSetPassword)}
        className="grid gap-6"
      >
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Set New Password
          </h2>
          <p className="text-muted-foreground leading-7">
            Choose a strong password for your account
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Password must be at least 8 characters and include uppercase,
            lowercase, number, and special character.
          </AlertDescription>
        </Alert>

        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
          {passwordForm.formState.isSubmitting
            ? "Resetting Password..."
            : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};
