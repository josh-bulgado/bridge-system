import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { useFetchBarangayConfig } from "@/features/admin/hooks/useFetchBarangayConfig";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const EnhancedOfficeInfoCard: React.FC = () => {
  const { data: config, isLoading, isError } = useFetchBarangayConfig();
  const [isExpanded, setIsExpanded] = useState(true);

  const isOfficeOpen = () => {
    // Simple check - can be enhanced with actual office hours parsing
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Assuming Monday-Friday, 8AM-5PM
    return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
  };

  const officeIsOpen = isOfficeOpen();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-gray-50 pb-3 dark:from-slate-950/50 dark:to-gray-950/50">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Barangay Office</CardTitle>
              <Badge
                variant={officeIsOpen ? "default" : "secondary"}
                className={cn(
                  "py-0 text-[10px]",
                  officeIsOpen
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {officeIsOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Contact info and hours
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load office information. Please try again later.
              </AlertDescription>
            </Alert>
          ) : !config ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Office information not available.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Office Hours */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="bg-background rounded-full p-1.5 shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h4 className="text-xs font-semibold">Office Hours</h4>
                    <p className="text-muted-foreground text-xs whitespace-pre-wrap">
                      {config.officeHours}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                  Contact Information
                </h4>

                {/* Phone */}
                <a
                  href={`tel:${config.contact.phone}`}
                  className="hover:bg-muted/50 group flex items-center gap-2 rounded-lg p-2 transition-colors"
                >
                  <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-950">
                    <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="text-xs font-medium group-hover:text-green-600 dark:group-hover:text-green-400">
                      {config.contact.phone}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${config.contact.email}`}
                  className="hover:bg-muted/50 group flex items-center gap-2 rounded-lg p-2 transition-colors"
                >
                  <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-950">
                    <Mail className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="text-xs font-medium break-all group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {config.contact.email}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>

                {/* Address */}
                <div className="bg-muted/30 flex items-start gap-2 rounded-lg p-2">
                  <div className="shrink-0 rounded-full bg-red-100 p-1.5 dark:bg-red-950">
                    <MapPin className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-muted-foreground text-xs">Address</p>
                    <p className="text-xs font-medium">
                      Barangay {config.address.barangayName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {config.address.municipalityName},{" "}
                      {config.address.provinceName}
                      <br />
                      {config.address.regionName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <Button
                variant="outline"
                className="h-8 w-full"
                size="sm"
                onClick={() => {
                  const address = `Barangay ${config.address.barangayName}, ${config.address.municipalityName}, ${config.address.provinceName}`;
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                    "_blank",
                  );
                }}
              >
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                Get Directions
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
