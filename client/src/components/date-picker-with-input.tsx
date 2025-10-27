import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerWithInputProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
}

export function DatePickerWithInput({
  date,
  onDateChange,
  placeholder = "Select a date",
  minDate,
  maxDate,
  className,
  disabled = false,
}: DatePickerWithInputProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date || new Date());
  const [value, setValue] = useState(formatDate(date));

  // Update input value when date prop changes
  useEffect(() => {
    setValue(formatDate(date));
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    
    // Try to parse the input as a date
    const parsedDate = new Date(inputValue);
    if (isValidDate(parsedDate)) {
      // Check date constraints
      if (minDate && parsedDate < minDate) return;
      if (maxDate && parsedDate > maxDate) return;
      
      setMonth(parsedDate);
      onDateChange?.(parsedDate);
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue(formatDate(selectedDate));
      setMonth(selectedDate);
      onDateChange?.(selectedDate);
    }
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        placeholder={placeholder}
        className="pr-10"
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !disabled) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-transparent"
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="size-4" />
            <span className="sr-only">Open calendar</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleCalendarSelect}
            fromDate={minDate}
            toDate={maxDate}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Keep the demo component for reference
export function Calendar28() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date("2025-06-01"));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  return (
    <DatePickerWithInput
      date={date}
      onDateChange={setDate}
      placeholder="June 01, 2025"
    />
  );
}
