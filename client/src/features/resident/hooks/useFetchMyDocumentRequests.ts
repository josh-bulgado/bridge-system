import { useQuery } from "@tanstack/react-query";
import { fetchMyDocumentRequests } from "../services/residentDocumentRequestService";
import { QUERY_KEYS, CACHE_STRATEGIES } from "@/lib/cache-config";

interface UseFetchMyDocumentRequestsParams {
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useFetchMyDocumentRequests = (params?: UseFetchMyDocumentRequestsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.myDocumentRequests(params),
    queryFn: () => fetchMyDocumentRequests(params),
    staleTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.staleTime,
    gcTime: CACHE_STRATEGIES.DOCUMENT_REQUESTS.gcTime,
  });
};
