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
import { DatePickerWithInput } from "@/components/date-picker-with-input";
import { Check, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const StepPersonalInfo = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const dateOfBirth = watch("dateOfBirth");

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <FieldGroup>
        <Field className="flex-1">
          <FieldLabel>First Name</FieldLabel>
          <Input 
            {...register("firstName")} 
            placeholder="Juan" 
            onInput={(e) => {
              // Only allow letters and spaces, capitalize first letter
              let value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
              value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              e.currentTarget.value = value;
            }}
          />
          <FieldError errors={errors.firstName ? [errors.firstName] : []} />
        </Field>

        <Field className="flex-1">
          <FieldLabel>Middle Name (Optional)</FieldLabel>
          <Input 
            {...register("middleName")} 
            placeholder="Santos" 
            onInput={(e) => {
              // Only allow letters and spaces, capitalize first letter
              let value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
              value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              e.currentTarget.value = value;
            }}
          />
        </Field>

        <Field className="flex-1">
          <FieldLabel>Last Name</FieldLabel>
          <Input 
            {...register("lastName")} 
            placeholder="Dela Cruz" 
            onInput={(e) => {
              // Only allow letters and spaces, capitalize first letter
              let value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
              value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              e.currentTarget.value = value;
            }}
          />
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
          <DatePickerWithInput
            date={dateOfBirth ? new Date(dateOfBirth) : undefined}
            onDateChange={(date) => {
              setValue("dateOfBirth", date ? date.toISOString().split('T')[0] : "");
            }}
            placeholder="Select your date of birth"
            maxDate={new Date()}
            minDate={new Date("1900-01-01")}
          />
          <FieldError errors={errors.dateOfBirth ? [errors.dateOfBirth] : []} />
        </Field>
      </FieldGroup>
    </div>
  );
};

export default StepPersonalInfo;