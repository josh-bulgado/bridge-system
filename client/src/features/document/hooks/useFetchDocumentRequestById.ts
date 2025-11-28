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
    // Refetch every 2 seconds when the query is enabled (dialog is open)
    refetchInterval: enabled ? 2000 : false,
    // Don't refetch on window focus when dialog is open (polling handles it)
    refetchOnWindowFocus: !enabled,
  });
};
