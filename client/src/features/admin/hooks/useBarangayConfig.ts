// hooks/useBarangayConfigExist.ts
import { useQuery } from "@tanstack/react-query";
import { barangayConfigService } from "../services/configService"; // Assuming this service uses Axios to fetch data

export function useBarangayConfig() {
  return useQuery({
    queryKey: ["barangayConfig"], // Unique key for the query
    queryFn: barangayConfigService.getBarangayConfig, // Function that fetches the data
    // onError: (error: any) => {
    //   // Handle error here
    //   console.error("Error fetching barangay config:", error);
    // },
    // onSuccess: (data) => {
    //   // Optionally handle successful data retrieval
    //   console.log("Barangay config fetched successfully", data);
    // },
  });
}
