/**
 * Removes common barangay prefixes from the name
 * Examples:
 * - "Bgy Del Rosario" → "Del Rosario"
 * - "Brgy Poblacion" → "Poblacion"
 * - "Barangay San Jose" → "San Jose"
 * - "Del Rosario" → "Del Rosario" (unchanged)
 */
export const cleanBarangayName = (name: string): string => {
  if (!name) return name;

  // Remove common prefixes (case-insensitive)
  const prefixes = [
    /^Barangay\s+/i,
    /^Brgy\.?\s+/i,
    /^Bgy\.?\s+/i,
  ];

  let cleaned = name.trim();
  
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, "");
  }

  return cleaned.trim();
};
