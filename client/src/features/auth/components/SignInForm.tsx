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
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { signInSchema, type SignInFormData } from "../schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSignIn } from "../hooks/useSignIn";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signIn } = useSignIn();
  const [error] = useState<string>("");

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

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-lg md:p-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        className="h-10 transition-all duration-200 focus:scale-[1.01]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="h-10 pr-10 transition-all duration-200 focus:scale-[1.01]"
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="transition-transform duration-200 hover:scale-110"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="remember-me"
                      className="text-sm font-normal text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                    >
                      Remember me for 30 days
                    </FormLabel>
                  </FormItem>
                )}
              />

            <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full h-10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button variant="outline" type="button" disabled className="w-full h-10 transition-all duration-200 hover:scale-[1.02] hover:border-primary/50">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:underline underline-offset-4 transition-all duration-200"
                >
                  Sign up
                </Link>
              </p>
          </form>
        </Form>
      </div>

      <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4 transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
