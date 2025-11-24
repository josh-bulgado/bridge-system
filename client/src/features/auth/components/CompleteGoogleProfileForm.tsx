import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  completeGoogleProfileSchema,
  type CompleteGoogleProfileFormData,
} from "../schemas/completeGoogleProfileSchema";
import { useCompleteGoogleProfile } from "../hooks/useCompleteGoogleProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DateColumnPicker } from "@/components/date-column-picker";
import { formatLocalDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";

export function CompleteGoogleProfileForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const completeMutation = useCompleteGoogleProfile();

  // Get data passed from sign-in
  const email = location.state?.email || "";
  const givenName = location.state?.givenName || "";
  const familyName = location.state?.familyName || "";
  const idToken = location.state?.idToken || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompleteGoogleProfileFormData>({
    resolver: zodResolver(completeGoogleProfileSchema),
    defaultValues: {
      firstName: givenName,
      lastName: familyName,
      extension: "",
      dateOfBirth: "",
    },
  });

  // Redirect if no email or token (shouldn't be on this page)
  useEffect(() => {
    if (!email || !idToken) {
      navigate("/sign-in");
    }
  }, [email, idToken, navigate]);

  const onSubmit = (data: CompleteGoogleProfileFormData) => {
    // Transform 10-digit number to 11-digit format (09xxxxxxxxx)
    const formattedData = {
      ...data,
      contactNumber: `0${data.contactNumber}`
    };

    completeMutation.mutate({
      idToken,
      ...formattedData,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            We need a bit more information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted pr-24"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-green-600 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Email verified by Google
              </p>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <Label htmlFor="middleName" className="flex items-center gap-2">
                Middle Name
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              </Label>
              <Input
                id="middleName"
                {...register("middleName")}
                placeholder="Enter your middle name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            {/* Extension */}
            <div className="space-y-2">
              <Label htmlFor="extension" className="flex items-center gap-2">
                Extension
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              </Label>
              <Controller
                name="extension"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                    value={field.value || "none"}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="jr">Jr.</SelectItem>
                      <SelectItem value="sr">Sr.</SelectItem>
                      <SelectItem value="ii">II</SelectItem>
                      <SelectItem value="iii">III</SelectItem>
                      <SelectItem value="iv">IV</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.extension && (
                <p className="text-sm text-red-500">{errors.extension.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DateColumnPicker
                    value={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) => {
                      field.onChange(formatLocalDate(date));
                    }}
                  />
                )}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
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
                <Input
                  id="contactNumber"
                  type="tel"
                  {...register("contactNumber")}
                  placeholder="9123456789"
                  maxLength={10}
                  className="rounded-l-none"
                  onInput={(e) => {
                    let value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    
                    // Auto-detect and handle "09" format - remove leading 0
                    if (value.startsWith("09")) {
                      value = value.slice(1); // Remove the leading 0
                    }
                    
                    // Limit to 10 digits (9XXXXXXXXX format)
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    
                    e.currentTarget.value = value;
                  }}
                />
              </div>
              {errors.contactNumber && (
                <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={completeMutation.isPending || !idToken}
            >
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
