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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { CheckCircle, AlertCircle, ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { authService } from "../services/authService";

// Step 1: Verify OTP schema
const otpVerificationSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

// Step 2: Password schema only
const passwordSetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
type PasswordSetData = z.infer<typeof passwordSetSchema>;

export const ResetPasswordForm = () => {
  const [step, setStep] = useState<"verify-otp" | "set-password" | "success">("verify-otp");
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const navigate = useNavigate();
  
  // Get email from sessionStorage instead of URL for security
  const emailFromStorage = sessionStorage.getItem('resetEmail') || "";
  
  // Redirect to forgot password if no email found
  if (!emailFromStorage && step === "verify-otp") {
    navigate('/forgot-password');
    return null;
  }

  // Step 1: OTP Verification Form
  const otpForm = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: emailFromStorage,
      otp: "",
    },
  });

  // Step 2: Password Reset Form (only password fields)
  const passwordForm = useForm<PasswordSetData>({
    resolver: zodResolver(passwordSetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onVerifyOtp = async (data: OtpVerificationData) => {
    try {
      // Verify OTP with the server before proceeding
      await authService.verifyResetOtp(data.email, data.otp);
      
      // Store the OTP and email for later use
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
      // Use the stored email and OTP from step 1
      await authService.resetPassword(emailFromStorage, verifiedOtp, data.newPassword);

      setStep("success");

      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });

      // Clear sensitive data from sessionStorage
      sessionStorage.removeItem('resetEmail');

      // Redirect to sign-in after 2 seconds
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to reset password. Please try again.";
      toast.error("Failed to reset password", {
        description: errorMessage,
      });
    }
  };

  // Success Screen
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
            <p className="text-muted-foreground leading-7">
              Your password has been successfully reset.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Redirecting you to sign in...
            </p>
          </div>
        </div>

        <Button asChild>
          <Link to="/sign-in">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  // Step 1: Verify OTP
  if (step === "verify-otp") {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="grid gap-6">
          <div className="mb-4 flex flex-col gap-2">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Verify Your Code
            </h2>
            <p className="text-muted-foreground leading-7">
              Enter the 6-digit verification code sent to your email
            </p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Check your email for the 6-digit verification code. The code
              expires in 10 minutes.
            </AlertDescription>
          </Alert>

          {emailFromStorage && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Sending code to: </span>
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
                    placeholder=""
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? (
              "Verifying..."
            ) : (
              <>
                Verify Code <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <FieldGroup>
            <FieldDescription className="text-center">
              Didn't receive the code?{" "}
              <Link
                to="/forgot-password"
                className="hover:text-primary underline underline-offset-4"
              >
                Resend code
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </Form>
    );
  }

  // Step 2: Set New Password
  return (
    <Form {...passwordForm}>
      <form onSubmit={passwordForm.handleSubmit(onSetPassword)} className="grid gap-6">
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
            Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </AlertDescription>
        </Alert>

        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="confirmPassword"
          render={({ field }) => {
            if (import.meta.env.DEV) {
              console.log("Confirm Password Field value:", field.value);
            }
            return (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    value={field.value}
                    onChange={(e) => {
                      if (import.meta.env.DEV) {
                        console.log("Field onChange called with:", e.target.value);
                      }
                      field.onChange(e.target.value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
          {passwordForm.formState.isSubmitting
            ? "Resetting Password..."
            : "Reset Password"}
        </Button>

        <FieldGroup>
          <FieldDescription className="text-center">
            <button
              type="button"
              onClick={() => setStep("verify-otp")}
              className="hover:text-primary underline underline-offset-4"
            >
              ← Back to verification
            </button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};
