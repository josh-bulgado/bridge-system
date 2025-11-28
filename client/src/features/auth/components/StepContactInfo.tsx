import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { useEmailAvailabilityContext } from "./RegistrationForm";

const StepContactInfo = () => {
  const { control } = useFormContext();
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const email = control._formValues?.email || "";
  const contactNumber = control._formValues?.contactNumber || "";

  // Email availability check
  const {
    isChecking,
    isAvailable,
    error: availabilityError,
  } = useEmailAvailability(email);

  // Get context to update parent form
  const { setEmailAvailable } = useEmailAvailabilityContext();

  // Update parent form whenever email availability changes
  useEffect(() => {
    setEmailAvailable(isAvailable);
  }, [isAvailable, setEmailAvailable]);

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
        <p className="text-muted-foreground text-sm">How can we reach you?</p>
      </div>

      <div className="space-y-6">
        {/* Email Field */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                Email Address
                <span className="text-red-500">*</span>
                {isChecking && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-5 px-2 py-0.5 text-[10px] font-normal"
                  >
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Checking...
                  </Badge>
                )}
                {!isChecking &&
                  email &&
                  isValidEmail(email) &&
                  isAvailable === true && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-normal text-green-600"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Available
                    </Badge>
                  )}
                {!isChecking &&
                  email &&
                  isValidEmail(email) &&
                  isAvailable === false && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-normal text-red-600"
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
                    className={`h-10 pl-10 ${
                      email && isValidEmail(email) && isAvailable === true
                        ? "border-green-300 focus:border-green-500"
                        : email && isValidEmail(email) && isAvailable === false
                          ? "border-red-300 focus:border-red-500"
                          : ""
                    }`}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onInput={(e) => {
                      const value = e.currentTarget.value
                        .toLowerCase()
                        .replace(/\s/g, "");
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                  />
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  {isChecking && (
                    <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin text-blue-600" />
                  )}
                  {!isChecking &&
                    email &&
                    isValidEmail(email) &&
                    isAvailable === true && (
                      <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-600" />
                    )}
                  {!isChecking &&
                    email &&
                    isValidEmail(email) &&
                    isAvailable === false && (
                      <XCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-red-600" />
                    )}
                </div>
              </FormControl>
              {emailFocused && !email && (
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Enter a valid email address for account verification and
                    important notifications
                  </AlertDescription>
                </Alert>
              )}
              {!isChecking &&
                email &&
                isValidEmail(email) &&
                isAvailable === false && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This email is already registered. Please use a different
                      email or try signing in.
                    </AlertDescription>
                  </Alert>
                )}
              {availabilityError && email && isValidEmail(email) && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {availabilityError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                Phone Number
                <span className="text-red-500">*</span>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <Info className="text-muted-foreground h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Used for resident directory and emergency contact
                    </p>
                  </TooltipContent>
                </Tooltip>
                {contactNumber && isValidPhone(contactNumber) && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-5 border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-normal text-green-600"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Valid
                  </Badge>
                )}
              </FormLabel>
              <FormControl>
                <div className="flex items-stretch">
                  <div className="bg-muted text-muted-foreground border-input flex h-10 items-center justify-center gap-2 rounded-l-md border border-r-0 px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 900 600"
                      className="h-4 w-6 shrink-0"
                      aria-hidden="true"
                    >
                      <rect width="900" height="600" fill="#0038a8" />
                      <rect width="900" height="300" y="300" fill="#ce1126" />
                      <polygon points="0,0 400,300 0,600" fill="#fff" />
                      <circle cx="180" cy="300" r="90" fill="#fcd116" />
                      <g fill="#fcd116">
                        <polygon points="180,180 195,260 165,260" />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(45, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(90, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(135, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(180, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(225, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(270, 180, 300)"
                        />
                        <polygon
                          points="180,180 195,260 165,260"
                          transform="rotate(315, 180, 300)"
                        />
                      </g>
                      <g fill="#fcd116" transform="translate(340, 300)">
                        <polygon
                          points="0,-20 6,0 0,20 -6,0"
                          transform="rotate(30)"
                        />
                      </g>
                      <g fill="#fcd116" transform="translate(110, 110)">
                        <polygon
                          points="0,-20 6,0 0,20 -6,0"
                          transform="rotate(-15)"
                        />
                      </g>
                      <g fill="#fcd116" transform="translate(110, 490)">
                        <polygon
                          points="0,-20 6,0 0,20 -6,0"
                          transform="rotate(75)"
                        />
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
                        let value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          "",
                        );

                        // Auto-detect and handle "09" format - remove leading 0
                        if (value.startsWith("09")) {
                          value = value.slice(1); // Remove the leading 0
                        }

                        // Limit to 10 digits (9XXXXXXXXX format)
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
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Enter your Philippine mobile number (e.g., 9123456789)
                  </AlertDescription>
                </Alert>
              )}
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepContactInfo;
