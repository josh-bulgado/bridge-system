import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Check } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StepContactInfo = () => {
  const { control, watch } = useFormContext();

  const email = watch("email");
  const contactNumber = watch("contactNumber") || "";

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
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Mail className="h-4 w-4" />
          Contact Information
        </CardTitle>
        <CardDescription>
          How can we reach you for important updates?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Email Address
                  <span className="text-red-500">*</span>
                  {email && isValidEmail(email) && (
                    <Badge
                      variant="secondary"
                      className="ml-2 border-green-200 bg-green-50 text-green-600"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Valid
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="your.email@example.com"
                    className="h-10"
                    onInput={(e) => {
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
                <FormLabel className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone Number
                  <span className="text-red-500">*</span>
                  {contactNumber && isValidPhone(contactNumber) && (
                    <Badge
                      variant="secondary"
                      className="ml-2 border-green-200 bg-green-50 text-green-600"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Valid
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    className="h-10"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StepContactInfo;
