/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";

export interface ResidentListItem {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  maritalStatus: string;
  localAddress: string;
  verificationStatus: "Not Submitted" | "Pending" | "Approved" | "Rejected" | "Under Review";
  isEmailVerified: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
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

export interface UpdateResidentRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  contactNumber?: string;
}

export interface ContactResidentRequest {
  message: string;
}

/**
 * Fetch all residents
 */
export const fetchResidents = async (): Promise<ResidentListItem[]> => {
  const response = await api.get("/resident");
  return response.data;
};

/**
 * Fetch a single resident by ID
 */
export const fetchResidentById = async (id: string): Promise<ResidentListItem> => {
  const response = await api.get(`/resident/${id}`);
  return response.data;
};

/**
 * Update resident information (admin only)
 */
export const updateResident = async (
  id: string,
  data: UpdateResidentRequest
): Promise<ResidentListItem> => {
  const response = await api.put(`/resident/${id}`, data);
  return response.data;
};

/**
 * Delete a resident (admin only)
 */
export const deleteResident = async (id: string): Promise<void> => {
  await api.delete(`/resident/${id}`);
};

/**
 * Approve resident verification
 */
export const approveResident = async (id: string): Promise<any> => {
  const response = await api.post(`/resident/${id}/approve`);
  return response.data;
};

/**
 * Reject resident verification
 */
export const rejectResident = async (id: string): Promise<any> => {
  const response = await api.post(`/resident/${id}/reject`);
  return response.data;
};

/**
 * Contact resident via email
 */
export const contactResident = async (
  id: string,
  message: string
): Promise<any> => {
  const response = await api.post(`/resident/${id}/contact`, { message });
  return response.data;
};

/**
 * Search residents by query
 */
export const searchResidents = async (query: string): Promise<ResidentListItem[]> => {
  const response = await api.get("/resident/search", {
    params: { query },
  });
  return response.data;
};

/**
 * Fetch residents by verification status
 */
export const fetchResidentsByStatus = async (
  status: "Pending" | "Approved" | "Rejected" | "Under Review"
): Promise<ResidentListItem[]> => {
  const response = await api.get(`/resident/status/${status}`);
  return response.data;
};

// Legacy export for backward compatibility
export const residentService = {
  getAllResidents: fetchResidents,
  approveResident,
  rejectResident,
  contactResident,
};
