import { useQuery } from "@tanstack/react-query";
import { fetchDocumentById } from "../services/documentService";

/**
 * Hook to fetch a single document by ID
 */
export const useFetchDocumentById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
