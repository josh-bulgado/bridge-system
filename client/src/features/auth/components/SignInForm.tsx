import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { signInSchema, type SignInFormData } from "../schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSignIn } from "../hooks/useSignIn";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signIn } = useSignIn();
  const [error] = useState<string>("");
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutate: googleSignIn, isPending: isGoogleLoading } =
    useGoogleSignIn();

  // Check for success message from navigation state
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: SignInFormData) => {
    signIn(data);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Exchange the access token for user info and ID token
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const userInfo = await response.json();

        // Check if it's a Gmail account
        if (!userInfo.email || !userInfo.email.endsWith("@gmail.com")) {
          toast.error("Only Gmail accounts are allowed for Google Sign-In.");
          return;
        }

        // Use the access token as ID token (we'll validate on backend)
        googleSignIn({ idToken: tokenResponse.access_token });
      } catch (error) {
        toast.error("Failed to authenticate with Google. Please try again.");
      }
    },
    onError: () => {
      toast.error("Google Sign-In was cancelled or failed.");
    },
  });

  return (
    <div className="w-full max-w-md">
      <div className="bg-card flex flex-col rounded-xl border p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {successMessage && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
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
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      className="h-10 transition-all duration-200 focus:scale-[1.01]"
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="mb-2 flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-10 pr-12 transition-all duration-200 focus:scale-[1.01]"
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-200 hover:scale-110 focus:outline-none"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      id="remember-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0 transition-transform duration-200 hover:scale-110"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="remember-me"
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-sm leading-none font-normal transition-colors"
                  >
                    Remember me for 30 days
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card text-muted-foreground px-4 text-xs font-medium tracking-wider uppercase">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                disabled={isGoogleLoading || form.formState.isSubmitting}
                onClick={() => handleGoogleLogin()}
                className=" h-11 w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGoogleLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </span>
                )}
              </Button>
            </div>

            <p className="text-muted-foreground pt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold underline-offset-4 transition-all duration-200 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};
