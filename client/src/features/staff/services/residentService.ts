import api from "@/lib/api";

export interface ResidentListItem {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  localAddress: string;
  verificationStatus: "Pending" | "Approved" | "Rejected" | "Under Review";
  isEmailVerified: boolean;
  registrationDate: string;
  verifiedDate: string | null;
  hasDocuments: boolean;
  // Verification documents
  governmentIdFront?: string;
  governmentIdBack?: string;
  proofOfResidency?: string;
  streetPurok?: string;
  houseNumberUnit?: string;
}

export const residentService = {
  /**
   * Get all residents
   */
  getAllResidents: async (): Promise<ResidentListItem[]> => {
    const response = await api.get("/resident");
    return response.data;
  },

  /**
   * Approve resident verification
   */
  approveResident: async (residentId: string): Promise<any> => {
    const response = await api.post(`/resident/${residentId}/approve`);
    return response.data;
  },

  /**
   * Reject resident verification
   */
  rejectResident: async (residentId: string): Promise<any> => {
    const response = await api.post(`/resident/${residentId}/reject`);
    return response.data;
  },

  /**
   * Contact resident via email
   */
  contactResident: async (residentId: string, message: string): Promise<any> => {
    const response = await api.post(`/resident/${residentId}/contact`, { message });
    return response.data;
  },
};
