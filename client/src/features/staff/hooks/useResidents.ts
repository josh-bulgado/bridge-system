import { useState, useEffect } from "react";
import { toast } from "sonner";
import { residentService, type ResidentListItem } from "../services/residentService";

export const useResidents = () => {
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentService.getAllResidents();
      // Sort by registration date - latest first
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return dateB - dateA; // Descending order (latest first)
      });
      setResidents(sortedData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch residents";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  return {
    residents,
    loading,
    error,
    refetch: fetchResidents,
  };
};
