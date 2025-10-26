import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

const StepContactInfo = () => {
  const { register } = useFormContext();

  return (
    <FieldGroup className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          {...register("email")}
          type="email"
          placeholder="m@example.com"
        />
      </Field>

      <Field>
        <FieldLabel>Contact Number</FieldLabel>
        <Input
          {...register("contactNumber")}
          type="tel"
          placeholder="09123456789"
        />
      </Field>

      <FieldGroup className="flex flex-col gap-4 md:flex-row">
        <Field className="flex-1">
          <FieldLabel>Password</FieldLabel>
          <Input {...register("password")} type="password" />
        </Field>
        <Field className="flex-1">
          <FieldLabel>Confirm Password</FieldLabel>
          <Input {...register("confirmPassword")} type="password" />
        </Field>
      </FieldGroup>
    </FieldGroup>
  );
};

export default StepContactInfo;
