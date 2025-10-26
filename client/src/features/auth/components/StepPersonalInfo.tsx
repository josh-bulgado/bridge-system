import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const StepPersonalInfo = () => {
  const { register, setValue, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <FieldGroup>
        <Field className="flex-1">
          <FieldLabel>First Name</FieldLabel>
          <Input {...register("firstName")} placeholder="Juan" />
          <FieldError errors={errors.firstName ? [errors.firstName] : []} />
        </Field>

        <Field className="flex-1">
          <FieldLabel>Middle Name (Optional)</FieldLabel>
          <Input {...register("middleName")} placeholder="Santos" />
        </Field>

        <Field className="flex-1">
          <FieldLabel>Last Name</FieldLabel>
          <Input {...register("lastName")} placeholder="Dela Cruz" />
          <FieldError errors={errors.lastName ? [errors.lastName] : []} />
        </Field>

        <Field>
          <FieldLabel>Extension</FieldLabel>
          <Select
            onValueChange={(val) => setValue("extensionName", val)}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">None</SelectItem>
              <SelectItem value="jr">Jr.</SelectItem>
              <SelectItem value="sr">Sr.</SelectItem>
              <SelectItem value="ii">II</SelectItem>
              <SelectItem value="iii">III</SelectItem>
              <SelectItem value="iv">IV</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field className="flex-1">
          <FieldLabel>Date of Birth</FieldLabel>
          <Input 
            type="date" 
            {...register("dateOfBirth")} 
            min="1900-01-01"
            max="2024-12-31"
            onInput={(e) => {
              const value = e.currentTarget.value;
              if (value && value.length > 10) {
                e.currentTarget.value = value.slice(0, 10);
              }
            }}
          />
          <FieldError errors={errors.dateOfBirth ? [errors.dateOfBirth] : []} />
        </Field>
      </FieldGroup>
    </div>
  );
};

export default StepPersonalInfo;
