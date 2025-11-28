import { useQuery } from "@tanstack/react-query";
import { fetchDocumentRequests } from "../services/documentRequestService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

interface UseFetchDocumentRequestsParams {
  status?: string;
  residentId?: string;
  page?: number;
  pageSize?: number;
  refetchInterval?: number;
}

export const useFetchDocumentRequests = (params?: UseFetchDocumentRequestsParams) => {
  const { refetchInterval, ...queryParams } = params || {};
  
  return useQuery({
    queryKey: QUERY_KEYS.documentRequestList(queryParams),
    queryFn: () => fetchDocumentRequests(queryParams),
    staleTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.staleTime,
    gcTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.gcTime,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
