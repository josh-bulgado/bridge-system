import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  ImageIcon,
  Mail,
} from "lucide-react";
import type { BarangayConfigFormData } from "../../schemas/barangayConfigSchema";

interface BarangayConfigViewProps {
  config: BarangayConfigFormData;
}

export const BarangayConfigView: React.FC<BarangayConfigViewProps> = ({
  config,
}) => {
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
    </div>
  );
};
