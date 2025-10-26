import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className={cn("flex flex-col gap-6")}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Access your account to manage document requests
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="email">Email or Phone Number</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-sm p-0.5"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                  
                  {/* Remember me and Forgot password row */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        className="transition-all duration-200"
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm underline-offset-2 hover:underline text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </Field>
                <Field>
                  <Button type="submit">Login</Button>
                </Field>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">Sign up</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  );
};
