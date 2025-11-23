import { useQuery } from "@tanstack/react-query";
import { fetchDocumentRequestById } from "../services/documentRequestService";

export const useFetchDocumentRequestById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["documentRequest", id],
    queryFn: () => fetchDocumentRequestById(id),
    enabled: !!id && enabled,
    staleTime: 30000, // 30 seconds
  });
};
