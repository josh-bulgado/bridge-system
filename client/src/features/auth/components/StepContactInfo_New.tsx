import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Check, AlertCircle, Info, Mail, Loader2, XCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEmailAvailability } from "../hooks/useEmailAvailability";

const StepContactInfo_New = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const email = control._formValues?.email || "";
  const contactNumber = control._formValues?.contactNumber || "";

  // Email availability check
  const { isChecking, isAvailable, error: availabilityError } = useEmailAvailability(email);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper
  const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    return /^[9][0-9]{9}$/.test(digitsOnly);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-muted-foreground text-sm">
          How can we reach you?
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Field */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Email Address
                <span className="text-red-500">*</span>
                {isChecking && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking...
                  </Badge>
                )}
                {!isChecking && email && isValidEmail(email) && isAvailable === true && (
                  <Badge
                    variant="secondary"
                    className="border-green-200 bg-green-50 text-green-600"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Available
                  </Badge>
                )}
                {!isChecking && email && isValidEmail(email) && isAvailable === false && (
                  <Badge
                    variant="secondary"
                    className="border-red-200 bg-red-50 text-red-600"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Already Registered
                  </Badge>
                )}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="your.email@example.com"
                    className={`h-10 pl-10 ${email && isValidEmail(email) && isAvailable === true
                      ? "border-green-300 focus:border-green-500"
                      : email && isValidEmail(email) && isAvailable === false
                        ? "border-red-300 focus:border-red-500"
                        : ""
                      }`}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onInput={(e) => {
                      const value = e.currentTarget.value.toLowerCase().replace(/\s/g, "");
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                  />
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  {isChecking && (
                    <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-blue-600 animate-spin" />
                  )}
                  {!isChecking && email && isValidEmail(email) && isAvailable === true && (
                    <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-600" />
                  )}
                  {!isChecking && email && isValidEmail(email) && isAvailable === false && (
                    <XCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-red-600" />
                  )}
                </div>
              </FormControl>
              {emailFocused && !email && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enter a valid email address for account verification and
                    important notifications
                  </AlertDescription>
                </Alert>
              )}
              {!isChecking && email && isValidEmail(email) && isAvailable === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This email is already registered. Please use a different email or try signing in.
                  </AlertDescription>
                </Alert>
              )}
              {availabilityError && email && isValidEmail(email) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {availabilityError}
                  </AlertDescription>
                </Alert>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Phone Number
                <span className="text-red-500">*</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Used for resident directory and emergency contact</p>
                  </TooltipContent>
                </Tooltip>
                {contactNumber && isValidPhone(contactNumber) && (
                  <Badge
                    variant="secondary"
                    className="border-green-200 bg-green-50 text-green-600"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Valid
                  </Badge>
                )}
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <div className="flex items-center justify-center px-3 py-2 border border-r-0 rounded-l-md bg-muted text-muted-foreground border-input h-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 900 600"
                      className="mr-2 h-4 w-6"
                      aria-hidden="true"
                    >
                      <rect width="900" height="600" fill="#0038a8" />
                      <rect width="900" height="300" y="300" fill="#ce1126" />
                      <polygon points="0,0 400,300 0,600" fill="#fff" />
                      <circle cx="180" cy="300" r="90" fill="#fcd116" />
                      <g fill="#fcd116">
                        <polygon points="180,180 195,260 165,260" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(45, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(90, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(135, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(180, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(225, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(270, 180, 300)" />
                        <polygon points="180,180 195,260 165,260" transform="rotate(315, 180, 300)" />
                      </g>
                      <g fill="#fcd116" transform="translate(340, 300)">
                        <polygon points="0,-20 6,0 0,20 -6,0" transform="rotate(30)" />
                      </g>
                      <g fill="#fcd116" transform="translate(110, 110)">
                        <polygon points="0,-20 6,0 0,20 -6,0" transform="rotate(-15)" />
                      </g>
                      <g fill="#fcd116" transform="translate(110, 490)">
                        <polygon points="0,-20 6,0 0,20 -6,0" transform="rotate(75)" />
                      </g>
                    </svg>
                    <span className="text-sm font-medium">+63</span>
                  </div>
                  <div className="relative flex-1">
                    <Input
                      {...field}
                      type="tel"
                      placeholder="9123456789"
                      className={`h-10 rounded-l-none ${contactNumber && isValidPhone(contactNumber) ? "border-green-300 focus:border-green-500" : ""}`}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => setPhoneFocused(false)}
                      onInput={(e) => {
                        let value = e.currentTarget.value.replace(/[^0-9]/g, "");
                        if (value.length > 10) {
                          value = value.slice(0, 10);
                        }
                        e.currentTarget.value = value;
                        field.onChange(value);
                      }}
                      maxLength={10}
                    />
                    {contactNumber && isValidPhone(contactNumber) && (
                      <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-600" />
                    )}
                  </div>
                </div>
              </FormControl>
              {phoneFocused && !contactNumber && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enter your Philippine mobile number (e.g., 9123456789)
                  </AlertDescription>
                </Alert>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepContactInfo_New;
