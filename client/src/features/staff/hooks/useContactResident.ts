import { useMutation } from "@tanstack/react-query";
import { contactResident } from "../../resident/services/residentService";
import { toast } from "sonner";

/**
 * Hook to contact a resident via email
 */
export const useContactResident = () => {
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      contactResident(id, message),
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to send message";
      toast.error(message);
    },
  });
};
