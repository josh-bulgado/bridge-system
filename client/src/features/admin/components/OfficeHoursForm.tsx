import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OfficeHoursFormProps {
form: any;
}

const OfficeHoursForm: React.FC<OfficeHoursFormProps> = ({ form }) => {
  const { register } = form;
  return (
    <div>
      <Label htmlFor="officeHours">Office Hours</Label>
      <Textarea
        id="officeHours"
        {...register("officeHours")}
        placeholder="Monday-Friday: 8:00 AM - 5:00 PM"
        rows={4}
        className="resize-none"
      />
    </div>
  );
};

export default OfficeHoursForm;
