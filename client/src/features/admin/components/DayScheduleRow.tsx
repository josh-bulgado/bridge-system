import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { type DaySchedule } from "../types/officeHours";
import TimePicker from "./TimePicker";

interface DayScheduleRowProps {
  day: string;
  schedule: DaySchedule;
  onChange: (schedule: DaySchedule) => void;
  onCopyFrom?: () => void;
  showCopyButton?: boolean;
}

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({
  day,
  schedule,
  onChange,
  onCopyFrom,
  showCopyButton = false,
}) => {
  const handleToggleOpen = (isOpen: boolean) => {
    onChange({
      ...schedule,
      isOpen,
      openTime: isOpen && !schedule.openTime ? "08:00 AM" : schedule.openTime,
      closeTime: isOpen && !schedule.closeTime ? "05:00 PM" : schedule.closeTime,
    });
  };

  const handleTimeChange = (field: "openTime" | "closeTime", value: string) => {
    onChange({
      ...schedule,
      [field]: value,
    });
  };

  const handleBreakTimeChange = (field: "start" | "end", value: string) => {
    onChange({
      ...schedule,
      breakTime: {
        ...schedule.breakTime,
        [field]: value,
      },
    });
  };

  const toggleBreakTime = () => {
    if (schedule.breakTime) {
      const { breakTime, ...rest } = schedule;
      onChange(rest);
    } else {
      onChange({
        ...schedule,
        breakTime: {
          start: "12:00 PM",
          end: "01:00 PM",
        },
      });
    }
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Label className="min-w-[100px] font-medium">{day}</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={schedule.isOpen}
              onCheckedChange={handleToggleOpen}
            />
            <span className="text-sm text-muted-foreground">
              {schedule.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>
        
        {showCopyButton && onCopyFrom && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyFrom}
            className="flex items-center gap-1"
          >
            <Copy className="h-3 w-3" />
            Copy from above
          </Button>
        )}
      </div>

      {schedule.isOpen && (
        <div className="space-y-3 pl-4 border-l-2 border-muted">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Open Time</Label>
              <TimePicker
                value={schedule.openTime}
                onChange={(value) => handleTimeChange("openTime", value)}
                placeholder="Opening time"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Close Time</Label>
              <TimePicker
                value={schedule.closeTime}
                onChange={(value) => handleTimeChange("closeTime", value)}
                placeholder="Closing time"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={!!schedule.breakTime}
              onCheckedChange={toggleBreakTime}
            />
            <Label className="text-sm">Include break time</Label>
          </div>

          {schedule.breakTime && (
            <div className="grid grid-cols-2 gap-3 pl-6 border-l border-dashed border-muted">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Break Start</Label>
                <TimePicker
                  value={schedule.breakTime.start}
                  onChange={(value) => handleBreakTimeChange("start", value)}
                  placeholder="Break start"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Break End</Label>
                <TimePicker
                  value={schedule.breakTime.end}
                  onChange={(value) => handleBreakTimeChange("end", value)}
                  placeholder="Break end"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayScheduleRow;