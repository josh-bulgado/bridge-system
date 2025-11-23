import { useQuery } from "@tanstack/react-query";
import { fetchDocumentRequests } from "../services/documentRequestService";

interface UseFetchDocumentRequestsParams {
  status?: string;
  residentId?: string;
  page?: number;
  pageSize?: number;
}

export const useFetchDocumentRequests = (params?: UseFetchDocumentRequestsParams) => {
  return useQuery({
    queryKey: ["documentRequests", params],
    queryFn: () => fetchDocumentRequests(params),
    staleTime: 30000, // 30 seconds
  });
};
