import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select time",
}) => {
  const timeOptions = React.useMemo(() => {
    const times: string[] = [];
    
    for (let hour = 1; hour <= 12; hour++) {
      for (const minute of ["00", "30"]) {
        for (const period of ["AM", "PM"]) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute} ${period}`;
          times.push(timeString);
        }
      }
    }
    
    return times;
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePicker;