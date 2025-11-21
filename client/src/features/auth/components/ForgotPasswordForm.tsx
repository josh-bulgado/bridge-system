import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { authService } from "../services/authService";

export const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Call the forgot password API
      await authService.forgotPassword(data.email);

      setSubmittedEmail(data.email);
      setIsSubmitted(true);

      toast.success("Reset code sent!", {
        description: "Check your email for password reset instructions.",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send reset email. Please try again.";
      toast.error("Failed to send reset email", {
        description: errorMessage,
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="grid gap-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Check Your Email
            </h2>
            <p className="text-muted-foreground leading-7">
              We've sent password reset instructions to
            </p>
            <p className="font-medium mt-1">{submittedEmail}</p>
          </div>
        </div>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              try again
            </button>
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => {
            // Store email in sessionStorage instead of URL for security
            sessionStorage.setItem('resetEmail', submittedEmail);
            navigate('/reset-password');
          }}
        >
          Enter Reset Code
        </Button>

        <FieldGroup>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link
              to="/sign-in"
              className="hover:text-primary underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Forgot Password?
          </h2>
          <p className="text-muted-foreground leading-7">
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send Reset Code"}
        </Button>

        <FieldGroup>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link
              to="/sign-in"
              className="hover:text-primary underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};
