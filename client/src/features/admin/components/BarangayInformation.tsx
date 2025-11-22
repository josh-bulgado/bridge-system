import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { BarangayConfigFormData } from "../schemas/barangayConfigSchema";

const BarangayInformation = ({
  existingConfig,
}: {
  existingConfig: BarangayConfigFormData;
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p>
              <strong>Region:</strong> {existingConfig?.address.regionName}
            </p>
            <p>
              <strong>Province:</strong> {existingConfig?.address.provinceName}
            </p>
            <p>
              <strong>City/Municipality:</strong>{" "}
              {existingConfig?.address.municipalityName}
            </p>
            <p>
              <strong>Barangay:</strong> {existingConfig?.address.barangayName}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Phone Number:</strong> {existingConfig?.contact.phone}
          </p>
          <p>
            <strong>Email Address:</strong> {existingConfig?.contact.email}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Office Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Operating Hours:</strong>{" "}
            {existingConfig?.officeHours || "Not specified"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarangayInformation;
