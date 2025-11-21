import { useFormContext } from "react-hook-form";
import { Check, AlertCircle, Shield } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrength } from "@/components/ui/password-strength";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import PasswordInput from "@/components/password-input";

const StepSecuritySetup = () => {
  const { control, watch } = useFormContext();

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  // Password match helper
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Security Setup</h3>
        <p className="text-muted-foreground text-sm">
          Secure your account with a strong password.
        </p>
      </div>

      <div className="space-y-4">
        {/* Password Fields */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <div>
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1 h-5">
                    Password
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder=""
                      autoFocus
                    />
                  </FormControl>
                  <div className="h-5 text-sm">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1 h-5">
                  Confirm Password
                  <span className="text-red-500">*</span>
                  {passwordsMatch && (
                    <Badge
                      variant="secondary"
                      className="border-green-200 bg-green-50 text-green-600 ml-auto animate-in fade-in zoom-in-95 duration-200"
                    >
                      <Check className="mr-1" size={12} />
                      Match
                    </Badge>
                  )}
                  {confirmPassword && !passwordsMatch && (
                    <Badge variant="destructive" className="ml-auto animate-in fade-in zoom-in-95 duration-200">
                      <AlertCircle className="mr-1" size={12} />
                      No Match
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder=""
                  />
                </FormControl>
                <div className="h-5 text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Password Strength Indicator - Plenty of space */}
        {password && (
          <div className="space-y-2">
            <PasswordStrength password={password} />
          </div>
        )}

        <Separator className="my-6" />

        {/* Terms Agreement Section */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="flex-1 space-y-1">
                  <FormLabel className="text-sm leading-relaxed font-normal">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary underline-offset-4 hover:underline"
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
      </div>
    </div>
  );
};

export default StepSecuritySetup;
