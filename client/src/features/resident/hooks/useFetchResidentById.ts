import { useQuery } from "@tanstack/react-query";
import { fetchResidentById } from "../services/residentService";

export function useFetchResidentById(id: string) {
  return useQuery({
    queryKey: ["resident"],
    queryFn: () => fetchResidentById(id),
  });
}
