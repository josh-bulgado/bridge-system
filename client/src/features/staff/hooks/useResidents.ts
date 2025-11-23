import { useFetchResidents } from "./useFetchResidents";

/**
 * Legacy hook for backward compatibility
 * Uses the new useFetchResidents hook internally with TanStack Query
 */
export const useResidents = () => {
  const { data, isLoading, error, refetch } = useFetchResidents();

  // Sort by registration date - latest first
  const sortedResidents = data
    ? [...data].sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return dateB - dateA; // Descending order (latest first)
      })
    : [];

  return {
    residents: sortedResidents,
    isLoading,
    error: error ? String(error) : null,
    refetch,
  };
};
