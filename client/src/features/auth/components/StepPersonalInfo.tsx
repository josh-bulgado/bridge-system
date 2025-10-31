import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePickerWithInput } from "@/components/date-picker-with-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatLocalDate } from "@/lib/date";

const StepPersonalInfo = () => {
  const { control } = useFormContext();

  return (
    <div className="flex gap-4">
      <div className="flex w-full flex-col gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Juan" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Middle Name <span className="text-gray-200">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Santos"
                  onInput={(e) => {
                    // Only allow letters and spaces, capitalize first letter
                    let value = e.currentTarget.value.replace(
                      /[^a-zA-Z\s]/g,
                      "",
                    );
                    value =
                      value.charAt(0).toUpperCase() +
                      value.slice(1).toLowerCase();
                    e.currentTarget.value = value;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dela Cruz" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="extensionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extension</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "none" ? null : value)
                }
                defaultValue={field.value}
                value={field.value ?? "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="jr">Jr.</SelectItem>
                  <SelectItem value="sr">Sr.</SelectItem>
                  <SelectItem value="ii">II</SelectItem>
                  <SelectItem value="iii">III</SelectItem>
                  <SelectItem value="iv">IV</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <DatePickerWithInput
                  value={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) => {
                    field.onChange(formatLocalDate(date));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepPersonalInfo;
