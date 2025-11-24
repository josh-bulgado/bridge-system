import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface UpdatePersonalInfoData {
  firstName: string;
  middleName?: string;
  lastName: string;
  extension?: string;
  dateOfBirth?: string;
  contactNumber: string;
  street?: string;
  houseNumber?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
}

export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePersonalInfoData) => {
      const response = await api.put("/api/user/profile", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
