import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";
import { cn } from "@/lib/utils";

const StepContactInfo = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const email = watch("email") || "";
  const contactNumber = watch("contactNumber") || "";
  
  // Validation logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(09|\+639)\d{9}$/;
  
  const isEmailValid = emailTouched && email.length > 0 && emailRegex.test(email);
  const isPhoneValid = phoneTouched && contactNumber.length > 0 && phoneRegex.test(contactNumber);
  
  // Password matching validation - real-time
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  
  // Only show mismatch when both passwords are the same length but different content
  const passwordsDontMatch = password.length > 0 && confirmPassword.length === password.length && password !== confirmPassword;
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <FieldGroup className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <div className="relative">
          <Input
            {...register("email")}
            type="email"
            placeholder="m@example.com"
            className={cn(
              isEmailValid && "border-green-500 focus:border-green-500 focus:ring-green-500"
            )}
            onFocus={() => setEmailTouched(true)}
          />
          {isEmailValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="h-4 w-4 text-green-500 transition-all duration-200" />
            </div>
          )}
        </div>
        <FieldError errors={errors.email ? [errors.email] : []} />
      </Field>

      <Field>
        <FieldLabel>Phone Number</FieldLabel>
        <div className="relative">
          <Input
            {...register("contactNumber")}
            type="tel"
            placeholder="09123456789"
            className={cn(
              isPhoneValid && "border-green-500 focus:border-green-500 focus:ring-green-500"
            )}
            onFocus={() => setPhoneTouched(true)}
            onInput={(e) => {
              // Only allow numbers and limit to 11 digits
              let value = e.currentTarget.value.replace(/[^0-9]/g, '');
              if (value.length > 11) {
                value = value.slice(0, 11);
              }
              e.currentTarget.value = value;
            }}
          />
          {isPhoneValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="h-4 w-4 text-green-500 transition-all duration-200" />
            </div>
          )}
        </div>
        <FieldError errors={errors.contactNumber ? [errors.contactNumber] : []} />
      </Field>

      <FieldGroup className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field className="flex-1">
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <Input 
                {...register("password")} 
                type={showPassword ? "text" : "password"} 
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
          </Field>
          <Field className="flex-1">
            <FieldLabel>Confirm Password</FieldLabel>
            <div className="relative">
              <Input 
                {...register("confirmPassword")} 
                type={showConfirmPassword ? "text" : "password"} 
                className={cn(
                  "pr-16",
                  passwordsMatch && "border-green-500 focus:border-green-500 focus:ring-green-500",
                  passwordsDontMatch && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              
              {/* Password match indicator */}
              {passwordsMatch && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-green-500 transition-all duration-200" />
                </div>
              )}
              
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-sm p-0.5"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
            
            {/* Fixed height container to prevent layout shift */}
            <div className="h-6 mt-2">
              {passwordsDontMatch && (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm">Passwords do not match</span>
                </div>
              )}
              
              {/* Form validation errors - only show if not already showing custom mismatch message */}
              {!passwordsDontMatch && (
                <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : []} />
              )}
            </div>
          </Field>
        </div>
        
        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2">
            <PasswordStrength password={password} />
          </div>
        )}
      </FieldGroup>
    </FieldGroup>
  );
};

export default StepContactInfo;
