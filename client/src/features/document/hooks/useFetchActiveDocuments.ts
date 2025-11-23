import { useQuery } from "@tanstack/react-query";
import { fetchActiveDocuments } from "../services/documentService";

/**
 * Hook to fetch active documents only
 */
export const useFetchActiveDocuments = () => {
  return useQuery({
    queryKey: ["documents", "active"],
    queryFn: fetchActiveDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
