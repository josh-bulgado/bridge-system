import { useQuery } from "@tanstack/react-query";
import { searchDocuments } from "../services/documentService";

/**
 * Hook to search documents by name
 */
export const useSearchDocuments = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["documents", "search", query],
    queryFn: () => searchDocuments(query),
    enabled: enabled && !!query && query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
