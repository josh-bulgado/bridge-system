import { useQuery } from "@tanstack/react-query";
import { fetchDocumentRequests } from "../services/documentRequestService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

interface UseFetchDocumentRequestsParams {
  status?: string;
  residentId?: string;
  page?: number;
  pageSize?: number;
}

export const useFetchDocumentRequests = (params?: UseFetchDocumentRequestsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.documentRequestList(params),
    queryFn: () => fetchDocumentRequests(params),
    staleTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.staleTime,
    gcTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.gcTime,
  });
};
