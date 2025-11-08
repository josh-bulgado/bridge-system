import { useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface DateSliderProps {
  value?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper function to get the number of days in a month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export function DateSlider({ value, onDateChange, className }: DateSliderProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // Allow ages up to 100
  const maxYear = currentYear - 13;   // Minimum age of 13

  // Initialize state from value prop
  const [month, setMonth] = useState(value ? value.getMonth() + 1 : 1);
  const [day, setDay] = useState(value ? value.getDate() : 1);
  const [year, setYear] = useState(value ? value.getFullYear() : maxYear);

  // Update state when value prop changes
  useEffect(() => {
    if (value) {
      setMonth(value.getMonth() + 1);
      setDay(value.getDate());
      setYear(value.getFullYear());
    }
  }, [value]);

  // Get max days for current month/year
  const maxDays = getDaysInMonth(month, year);

  // Update date when any slider changes
  useEffect(() => {
    // Adjust day if it's greater than the max days in the selected month
    const adjustedDay = Math.min(day, maxDays);
    if (adjustedDay !== day) {
      setDay(adjustedDay);
      return; // Return early to avoid creating date with wrong day
    }
    
    const newDate = new Date(year, month - 1, adjustedDay);
    onDateChange?.(newDate);
  }, [month, day, year, maxDays]); // Remove onDateChange from dependencies

  const handleMonthChange = useCallback((values: number[]) => {
    setMonth(values[0]);
  }, []);

  const handleDayChange = useCallback((values: number[]) => {
    setDay(values[0]);
  }, []);

  const handleYearChange = useCallback((values: number[]) => {
    setYear(values[0]);
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Month Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Month</label>
          <span className="text-sm text-muted-foreground font-mono">
            {months[month - 1]}
          </span>
        </div>
        <Slider
          value={[month]}
          onValueChange={handleMonthChange}
          min={1}
          max={12}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Day Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Day</label>
          <span className="text-sm text-muted-foreground font-mono">
            {day}
          </span>
        </div>
        <Slider
          value={[day]}
          onValueChange={handleDayChange}
          min={1}
          max={maxDays}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>{maxDays}</span>
        </div>
      </div>

      {/* Year Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Year</label>
          <span className="text-sm text-muted-foreground font-mono">
            {year}
          </span>
        </div>
        <Slider
          value={[year]}
          onValueChange={handleYearChange}
          min={minYear}
          max={maxYear}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="mt-4 p-3 bg-muted rounded-md">
        <div className="text-sm text-muted-foreground">Selected Date:</div>
        <div className="text-lg font-semibold">
          {months[month - 1]} {day}, {year}
        </div>
      </div>
    </div>
  );
}