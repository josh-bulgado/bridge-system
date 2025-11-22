import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
form: any
}

const ContactForm: React.FC<ContactFormProps> = ({form}: ContactFormProps) => {
  const { register, formState: { errors }, watch } = form;
  return (
    <div>
      <Label htmlFor="phone">Phone Number *</Label>
      <Input
        value={watch}
        id="phone"
        {...register("contact.phone", { required: "Phone number is required" })}
        placeholder="+63 2 1234 5678"
        className={errors.contact?.phone ? "border-red-500" : ""}
      />
      {errors.contact?.phone && (
        <p className="text-sm text-red-500">{errors.contact.phone.message}</p>
      )}

      <Label htmlFor="email">Email Address *</Label>
      <Input
        id="email"
        type="email"
        {...register("contact.email", { required: "Email is required" })}
        placeholder="barangay@example.com"
        className={errors.contact?.email ? "border-red-500" : ""}
      />
      {errors.contact?.email && (
        <p className="text-sm text-red-500">{errors.contact.email.message}</p>
      )}
    </div>
  );
};

export default ContactForm;
