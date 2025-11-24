import { useQuery } from "@tanstack/react-query";
import { fetchMyDocumentRequests } from "../services/residentDocumentRequestService";

interface UseFetchMyDocumentRequestsParams {
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useFetchMyDocumentRequests = (params?: UseFetchMyDocumentRequestsParams) => {
  return useQuery({
    queryKey: ["myDocumentRequests", params],
    queryFn: () => fetchMyDocumentRequests(params),
    staleTime: 30000, // 30 seconds
  });
};
