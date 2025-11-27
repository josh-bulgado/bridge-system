/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateColumnPickerProps {
  value?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
  hideLabels?: boolean;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper function to get the number of days in a month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

// Generate array of numbers for scrolling
const generateArray = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function DateColumnPicker({
  value,
  onDateChange,
  className,
  hideLabels = false,
}: DateColumnPickerProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // Allow ages up to 100
  const maxYear = currentYear - 13; // Minimum age of 13

  // Initialize state from value prop
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    value ? value.getMonth() : undefined,
  );
  const [selectedDay, setSelectedDay] = useState<number | undefined>(
    value ? value.getDate() : undefined,
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    value ? value.getFullYear() : undefined,
  );

  // Update state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedMonth(value.getMonth());
      setSelectedDay(value.getDate());
      setSelectedYear(value.getFullYear());
    }
  }, [value]);

  // Generate years array
  const years = generateArray(minYear, maxYear);

  // Get max days for current month/year
  const maxDays = getDaysInMonth(
    (selectedMonth !== undefined ? selectedMonth : 0) + 1,
    selectedYear || maxYear
  );
  const days = generateArray(1, maxDays);

  // Create new date and call onChange
  const updateDate = (month: number | undefined, day: number | undefined, year: number | undefined) => {
    if (month === undefined || day === undefined || year === undefined) {
      onDateChange?.(undefined);
      return;
    }

    // Adjust day if it's greater than the max days in the selected month
    const adjustedDay = Math.min(day, getDaysInMonth(month + 1, year));
    const newDate = new Date(year, month, adjustedDay);
    onDateChange?.(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = parseInt(monthIndex);
    setSelectedMonth(newMonth);
    updateDate(newMonth, selectedDay, selectedYear);
  };

  const handleDayChange = (dayValue: string) => {
    const newDay = parseInt(dayValue);
    setSelectedDay(newDay);
    updateDate(selectedMonth, newDay, selectedYear);
  };

  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue);
    setSelectedYear(newYear);
    updateDate(selectedMonth, selectedDay, newYear);
  };

  // Adjust day if current day is invalid for the selected month
  useEffect(() => {
    if (selectedDay !== undefined && selectedDay > maxDays) {
      const adjustedDay = maxDays;
      setSelectedDay(adjustedDay);
      updateDate(selectedMonth, adjustedDay, selectedYear);
    }
  }, [maxDays, selectedMonth, selectedYear, selectedDay]);

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-[2fr_1fr_1.2fr] gap-3">
        {/* Month Select */}
        <div className="space-y-2">
          {!hideLabels && <label className="text-sm font-medium text-foreground">Month</label>}
          <Select
            value={selectedMonth !== undefined ? selectedMonth.toString() : ""}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day Select */}
        <div className="space-y-2">
          {!hideLabels && <label className="text-sm font-medium text-foreground">Day</label>}
          <Select
            value={selectedDay !== undefined ? selectedDay.toString() : ""}
            onValueChange={handleDayChange}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Select */}
        <div className="space-y-2">
          {!hideLabels && <label className="text-sm font-medium text-foreground">Year</label>}
          <Select
            value={selectedYear !== undefined ? selectedYear.toString() : ""}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
