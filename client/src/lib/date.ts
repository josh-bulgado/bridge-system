export function formatLocalDate(date?: Date): string {
  if (!date) return "";
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila", // Ensures PH timezone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date); // → "2025-08-21"
}
