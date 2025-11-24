import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Phone, Mail, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useFetchBarangayConfig } from "@/features/admin/hooks/useFetchBarangayConfig";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const OfficeInfoCard: React.FC = () => {
  const { data: config, isLoading, isError } = useFetchBarangayConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay Office Information</CardTitle>
        <CardDescription>
          Contact us or visit during office hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="ml-6 h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="ml-6 h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="ml-6 h-4 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="ml-6 h-10 w-full" />
            </div>
          </>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load barangay information. Please try again later.
            </AlertDescription>
          </Alert>
        ) : !config ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Barangay information not available.
          </div>
        ) : (
          <>
            {/* Office Hours */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Office Hours</span>
              </div>
              <div className="ml-6 whitespace-pre-wrap text-sm text-muted-foreground">
                {config.officeHours}
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>Contact Number</span>
              </div>
              <div className="ml-6 text-sm text-muted-foreground">
                <a
                  href={`tel:${config.contact.phone}`}
                  className="hover:text-primary hover:underline"
                >
                  {config.contact.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Email Address</span>
              </div>
              <div className="ml-6 text-sm text-muted-foreground">
                <a
                  href={`mailto:${config.contact.email}`}
                  className="hover:text-primary hover:underline"
                >
                  {config.contact.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Office Address</span>
              </div>
              <div className="ml-6 text-sm text-muted-foreground">
                Barangay {config.address.barangayName}
                <br />
                {config.address.municipalityName}, {config.address.provinceName}
                <br />
                {config.address.regionName}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
