import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  ImageIcon,
  Mail,
  Wallet,
  Copy,
  CheckCircle2,
} from "lucide-react";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface BarangayConfigViewProps {
  config: BarangayConfigFormData;
}

export const BarangayConfigView: React.FC<BarangayConfigViewProps> = ({
  config,
}) => {
  const [copiedNumber, setCopiedNumber] = React.useState(false);

  // Check if GCash is configured (all fields must be filled)
  const isGCashConfigured = 
    config.gcashQrCodeUrl && 
    config.gcashNumber && 
    config.gcashAccountName;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Preview - Compact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Square Logo - 1:1 aspect ratio */}
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage
                src={config.logoUrl}
                alt="Barangay Logo"
                className="aspect-square object-cover"
              />
              <AvatarFallback className="rounded-lg text-xl">
                {config.address.barangayName ? (
                  config.address.barangayName.substring(0, 2).toUpperCase()
                ) : (
                  <ImageIcon className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                Barangay {config.address.barangayName}
              </h3>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Captain: {config.barangayCaptain}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information Preview - Compact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">
            Barangay {config.address.barangayName},{" "}
            {config.address.municipalityName}, {config.address.provinceName}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {config.address.regionName}
          </p>
        </CardContent>
      </Card>

      {/* Contact Information Preview - Compact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span>{config.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              <span>{config.contact.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Hours Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Office Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
            {config.officeHours}
          </div>
        </CardContent>
      </Card>

      {/* GCash Payment Configuration - Only show if configured */}
      {isGCashConfigured && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              GCash Payment 
              <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Display */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  GCash QR Code
                </h4>
                <div className="flex justify-center md:justify-start">
                  <div className="rounded-lg border-2 border-primary/20 p-3 bg-white w-fit">
                    <img
                      src={config.gcashQrCodeUrl}
                      alt="GCash QR Code"
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    GCash Number
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border bg-muted p-3">
                      <p className="text-lg font-bold font-mono">
                        {config.gcashNumber}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(config.gcashNumber!)}
                      className="shrink-0"
                    >
                      {copiedNumber ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Account Name
                  </h4>
                  <div className="rounded-lg border bg-muted p-3">
                    <p className="text-base font-bold">
                      {config.gcashAccountName}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mt-4">
                  <p className="text-xs text-blue-900">
                    <strong>Status:</strong> GCash payment is enabled. Residents can pay online using this QR code and account details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
