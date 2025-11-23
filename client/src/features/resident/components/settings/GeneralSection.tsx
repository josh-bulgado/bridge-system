import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function GeneralSection() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("auto-detect");

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const languageOptions = [
    { value: "auto-detect", label: "Auto-detect" },
    { value: "en", label: "English" },
    { value: "fil", label: "Filipino" },
    { value: "es", label: "Spanish" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">General</h3>
        <Separator className="mt-2" />
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Appearance</Label>
          {mounted ? (
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="h-10 w-[180px] rounded-md border bg-input animate-pulse" />
          )}
        </div>
      </div>

      {/* Language Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
