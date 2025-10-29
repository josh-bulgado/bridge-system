import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const StepContactInfo = () => {
  const { control, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password") || "";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="john.doe@example.com"
                onInput={(e) => {
                  // Convert to lowercase and remove spaces
                  const value = e.currentTarget.value.toLowerCase().trim();
                  e.currentTarget.value = value;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contactNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="09123456789"
                onInput={(e) => {
                  // Only allow numbers and limit to 11 digits
                  let value = e.currentTarget.value.replace(/[^0-9]/g, "");
                  if (value.length > 11) {
                    value = value.slice(0, 11);
                  }
                  e.currentTarget.value = value;
                  field.onChange(value);
                }}
                maxLength={11}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
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
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground focus:ring-opacity-50 absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 transition-all duration-200 ease-in-out hover:scale-110 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <div className="transition-transform duration-200 ease-in-out">
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 transition-opacity duration-150 ease-in-out" />
                      ) : (
                        <Eye className="h-4 w-4 transition-opacity duration-150 ease-in-out" />
                      )}
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="mt-2">
          <PasswordStrength password={password} />
        </div>
      )}
    </div>
  );
};

export default StepContactInfo;
