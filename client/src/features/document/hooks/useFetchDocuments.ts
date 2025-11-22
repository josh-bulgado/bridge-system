import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "../services/documentService";

/**
 * Hook to fetch all documents
 */
export const useFetchDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
