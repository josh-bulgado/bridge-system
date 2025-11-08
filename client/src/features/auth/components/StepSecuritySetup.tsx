import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Check, AlertCircle, Shield } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const StepSecuritySetup = () => {
  const { control, watch } = useFormContext();

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  // Password match helper
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Security Setup
        </CardTitle>
        <CardDescription>
          Create a strong password to protect your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Password
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter a secure password"
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Strength Indicator - Plenty of space */}
            {password && (
              <div className="space-y-2">
                <PasswordStrength password={password} />
              </div>
            )}
          </div>

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Confirm Password
                  <span className="text-red-500">*</span>
                  {passwordsMatch && (
                    <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Match
                    </Badge>
                  )}
                  {confirmPassword && !passwordsMatch && (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No Match
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm your password"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-6" />

        {/* Terms Agreement Section */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="flex-1 space-y-1">
                  <FormLabel className="text-sm font-normal leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StepSecuritySetup;