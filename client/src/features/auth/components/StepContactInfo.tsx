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
    // Check for basic structure and common issues
    if (!email || email.length === 0) return false;
    
    // Check for multiple @ symbols
    if ((email.match(/@/g) || []).length !== 1) return false;
    
    // Check for consecutive dots
    if (/\.\./.test(email)) return false;
    
    // Check for dots at the start or end
    if (email.startsWith('.') || email.endsWith('.')) return false;
    
    // Check for @ at the start or end
    if (email.startsWith('@') || email.endsWith('@')) return false;
    
    // Split by @ to validate local and domain parts
    const [localPart, domainPart] = email.split('@');
    
    // Validate local part (before @)
    if (!localPart || localPart.length === 0) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (!/^[a-zA-Z0-9._+-]+$/.test(localPart)) return false;
    
    // Validate domain part (after @)
    if (!domainPart || domainPart.length === 0) return false;
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
    if (domainPart.startsWith('-') || domainPart.endsWith('-')) return false;
    
    // Domain must have at least one dot
    if (!domainPart.includes('.')) return false;
    
    // Validate domain format
    if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) return false;
    
    // Check TLD (last part after final dot) - must be at least 2 characters
    const tld = domainPart.split('.').pop();
    if (!tld || tld.length < 2) return false;
    if (!/^[a-zA-Z]+$/.test(tld)) return false;
    
    return true;
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1">
                  Email Address
                  <span className="text-red-500">*</span>
                  {email && isValidEmail(email) && (
                    <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200 ml-auto animate-in fade-in zoom-in-95 duration-200">
                      <Check className="h-3 w-3 mr-1" />
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
                    autoFocus
                    onInput={(e) => {
                      const value = e.currentTarget.value.toLowerCase().trim();
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <div className="h-5 text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone Number
                  <span className="text-red-500">*</span>
                  {contactNumber && isValidPhone(contactNumber) && (
                    <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200 ml-auto animate-in fade-in zoom-in-95 duration-200">
                      <Check className="h-3 w-3 mr-1" />
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
                <div className="h-5 text-sm">
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

export default StepContactInfo;
