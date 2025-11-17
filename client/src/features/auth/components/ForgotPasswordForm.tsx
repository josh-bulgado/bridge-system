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
import { Link } from "react-router-dom";
import { useState } from "react";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldDescription, FieldGroup } from "@/components/ui/field";

export const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log("hello");

      // TODO: Implement forgot password API call
      // const response = await authService.forgotPassword(data);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmittedEmail(data.email);
      setIsSubmitted(true);

      toast.success("Reset link sent!", {
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
      <div className="flex flex-col gap-6 rounded-md border pb-8 shadow-sm lg:rounded-none lg:border-none lg:shadow-none">
        <div className="p-6 md:p-8">
          <div className="grid gap-6">
            <div className="mb-8 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground leading-7 not-first:mt-0">
                  We've sent password reset instructions to
                </p>
                <p className="font-medium">{submittedEmail}</p>
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
                  className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
                >
                  try again
                </button>
              </AlertDescription>
            </Alert>

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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-md border pb-8 shadow-sm lg:rounded-none lg:border-none lg:shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="grid gap-6">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Forgot Password?
              </h2>
              <p className="text-muted-foreground leading-7 not-first:mt-0">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            {/* {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )} */}

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
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
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
        </form>
      </Form>
    </div>
  );
};
