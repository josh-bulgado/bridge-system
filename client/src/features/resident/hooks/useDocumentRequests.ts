import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import documentRequestService, {
  type CreateDocumentRequestDto,
} from "../services/documentRequestService";
import { toast } from "sonner";

export const useDocumentRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error, refetch } = useQuery({
    queryKey: ["documentRequests"],
    queryFn: documentRequestService.getMyRequests,
  });

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ["documentRequestStatistics"],
    queryFn: documentRequestService.getMyStatistics,
  });

  const createRequestMutation = useMutation({
    mutationFn: documentRequestService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["documentRequestStatistics"] });
      toast.success("Request submitted successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit request";
      toast.error(message);
    },
  });

  const createRequest = async (data: CreateDocumentRequestDto) => {
    return createRequestMutation.mutateAsync(data);
  };

  return {
    requests,
    statistics,
    isLoading,
    isLoadingStats,
    error,
    createRequest,
    isCreating: createRequestMutation.isPending,
    refetch,
  };
};

export const useDocumentTypes = () => {
  const { data: documentTypes, isLoading, error } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: documentRequestService.getActiveDocumentTypes,
  });

  return {
    documentTypes,
    isLoading,
    error,
  };
};
