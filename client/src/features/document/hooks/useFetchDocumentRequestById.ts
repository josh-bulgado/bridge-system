import { useQuery } from "@tanstack/react-query";
import { fetchDocumentRequestById } from "../services/documentRequestService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

export const useFetchDocumentRequestById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.documentRequestDetail(id),
    queryFn: () => fetchDocumentRequestById(id),
    enabled: !!id && enabled,
    staleTime: CACHE_STRATEGIES.DOCUMENT_REQUEST_DETAIL.staleTime,
    gcTime: CACHE_STRATEGIES.DOCUMENT_REQUEST_DETAIL.gcTime,
  });
};
