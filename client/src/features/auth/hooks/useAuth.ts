import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
}
