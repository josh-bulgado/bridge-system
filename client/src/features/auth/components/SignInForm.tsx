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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInSchema, type SignInFormData } from "../schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { authService } from "../services/authService";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

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
    try {
      setError("");
      const response = await authService.login(data);

      toast.success("Login successful!", {
        description: `Welcome back, ${response.name}!`,
      });

      // Navigate based on user role or to dashboard
      // For now, navigate to a general dashboard
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error("Login failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-md border bg-white pb-8 shadow-sm lg:rounded-none lg:border-none lg:shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="grid gap-6">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Welcome Back!
              </h2>
              <p className="leading-7 not-first:mt-0">
                Access your account to manage document requests
              </p>
            </div>

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
                      placeholder="m@example.com"
                      {...field}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground focus:ring-opacity-50 absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 transition-all duration-200 ease-in-out hover:scale-110 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <div className="transition-transform duration-200 ease-in-out">
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 transition-opacity duration-150 ease-in-out" />
                          ) : (
                            <Eye className="h-4 w-4 transition-opacity duration-150 ease-in-out" />
                          )}
                        </div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Remember me + Forgot password */}
                  <div className="mt-3 flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                          <FormControl>
                            <Checkbox
                              id="remember-me"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="transition-all duration-200"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="remember-me"
                            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors duration-200"
                          >
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground hover:text-foreground text-sm underline-offset-2 transition-colors duration-200 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Login"}
            </Button>

            <FieldGroup>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
        </form>
      </Form>

      <Separator />

      <p className="text-muted-foreground px-6 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
