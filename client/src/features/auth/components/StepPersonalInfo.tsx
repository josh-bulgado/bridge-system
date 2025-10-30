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
                <Input
                  {...field}
                  placeholder="Juan"
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
                <Input
                  {...field}
                  placeholder="Dela Cruz"
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
          name="extensionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extension</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value=" ">None</SelectItem>
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
                  date={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) => {
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : "",
                    );
                  }}
                  placeholder="June 01, 2025"
                  maxDate={new Date()}
                  minDate={new Date("1900-01-01")}
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
