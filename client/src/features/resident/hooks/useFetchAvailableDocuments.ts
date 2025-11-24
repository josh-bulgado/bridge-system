import { useQuery } from "@tanstack/react-query";
import { fetchAvailableDocuments } from "../services/residentDocumentRequestService";

/**
 * Hook to fetch active/available documents for residents
 */
export const useFetchAvailableDocuments = () => {
  return useQuery({
    queryKey: ["availableDocuments"],
    queryFn: fetchAvailableDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
