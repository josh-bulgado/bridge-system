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

      <div className="space-y-6">
        {/* Password Fields */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
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
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  Confirm Password
                  <span className="text-red-500">*</span>
                  {passwordsMatch && (
                    <Badge
                      variant="secondary"
                      className="ml-auto border-green-200 bg-green-50 text-green-600 text-[10px] px-2 py-0.5 h-5 font-normal animate-in fade-in zoom-in-95 duration-200"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Match
                    </Badge>
                  )}
                  {confirmPassword && !passwordsMatch && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-2 py-0.5 h-5 font-normal animate-in fade-in zoom-in-95 duration-200">
                      <AlertCircle className="mr-1 h-3 w-3" />
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
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="pt-2">
            <PasswordStrength password={password} />
          </div>
        )}

        <Separator />

        {/* Terms Agreement Section */}
        <FormField
          control={control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
              </FormControl>
              <div className="flex-1 space-y-1">
                <FormLabel className="text-sm leading-normal font-normal cursor-pointer">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary underline-offset-4 hover:underline font-medium"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary underline-offset-4 hover:underline font-medium"
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
  );
};

export default StepSecuritySetup;
