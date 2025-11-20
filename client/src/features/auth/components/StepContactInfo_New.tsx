import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Check, AlertCircle, Info, Mail, Phone } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StepContactInfo_New = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const email = control._formValues?.email || "";
  const contactNumber = control._formValues?.contactNumber || "";

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper
  const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    return /^09[0-9]{9}$/.test(digitsOnly);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Field */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Email Address
                <span className="text-red-500">*</span>
                {email && isValidEmail(email) && (
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
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="your.email@example.com"
                    className={`h-10 pl-10 ${email && isValidEmail(email) ? "border-green-300 focus:border-green-500" : ""}`}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onInput={(e) => {
                      const value = e.currentTarget.value.toLowerCase().trim();
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                  />
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  {email && isValidEmail(email) && (
                    <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-600" />
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
                <div className="relative">
                  <Input
                    {...field}
                    type="tel"
                    placeholder="09123456789"
                    className={`h-10 pl-10 ${contactNumber && isValidPhone(contactNumber) ? "border-green-300 focus:border-green-500" : ""}`}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    onInput={(e) => {
                      let value = e.currentTarget.value.replace(/[^0-9]/g, "");
                      if (value.length > 11) {
                        value = value.slice(0, 11);
                      }
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                    maxLength={11}
                  />
                  <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  {contactNumber && isValidPhone(contactNumber) && (
                    <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-600" />
                  )}
                </div>
              </FormControl>
              {phoneFocused && !contactNumber && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enter your Philippine mobile number (e.g., 09123456789)
                  </AlertDescription>
                </Alert>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default StepContactInfo_New;
