import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddressForm from "./AddressForm";
import ContactForm from "./ContactForm";
import OfficeHoursForm from "./OfficeHoursForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  barangayConfigSchema,
  type BarangayConfigFormData,
} from "../schemas/barangayConfigSchema";
import { zodResolver } from "@hookform/resolvers/zod";



const BarangayConfigForm = ({
  isLoading,
  onSave,
}: {
  isLoading: boolean;
  onSave: (data: BarangayConfigFormData) => void;
}) => {
  
  const form = useForm<BarangayConfigFormData>({
    resolver: zodResolver(barangayConfigSchema),
    defaultValues: {
      address: {
        regionCode: "",
        regionName: "",
        provinceCode: "",
        provinceName: "",
        municipalityCode: "",
        municipalityName: "",
        barangayCode: "",
        barangayName: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      officeHours: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
      {/* Address Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm form={form} />
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm form={form} />
        </CardContent>
      </Card>

      {/* Office Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle>Office Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficeHoursForm form={form} />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BarangayConfigForm;
