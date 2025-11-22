import api from "@/lib/api";
import type {
  Staff,
  CreateStaffRequest,
  UpdateStaffRequest,
  ToggleStaffStatusRequest,
  UpdateStaffRoleRequest,
} from "../types/staff";

/**
 * Fetch all staff members
 */
export const fetchStaff = async (): Promise<Staff[]> => {
  const response = await api.get("/staff");
  return response.data;
};

/**
 * Fetch a single staff member by ID
 */
export const fetchStaffById = async (id: string): Promise<Staff> => {
  const response = await api.get(`/staff/${id}`);
  return response.data;
};

/**
 * Create a new staff member
 */
export const createStaff = async (
  data: CreateStaffRequest,
): Promise<Staff> => {
  const response = await api.post("/staff", data);
  return response.data;
};

/**
 * Update an existing staff member
 */
export const updateStaff = async (
  id: string,
  data: UpdateStaffRequest,
): Promise<Staff> => {
  const response = await api.put(`/staff/${id}`, data);
  return response.data;
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (id: string): Promise<void> => {
  await api.delete(`/staff/${id}`);
};

/**
 * Toggle staff status (Activate/Deactivate)
 */
export const toggleStaffStatus = async (
  id: string,
  data: ToggleStaffStatusRequest,
): Promise<Staff> => {
  const response = await api.patch(`/staff/${id}/status`, data);
  return response.data;
};

/**
 * Update staff role
 */
export const updateStaffRole = async (
  id: string,
  data: UpdateStaffRoleRequest,
): Promise<Staff> => {
  const response = await api.patch(`/staff/${id}/role`, data);
  return response.data;
};

/**
 * Fetch active staff only
 */
export const fetchActiveStaff = async (): Promise<Staff[]> => {
  const response = await api.get("/staff/active");
  return response.data;
};

/**
 * Search staff by email
 */
export const searchStaff = async (query: string): Promise<Staff[]> => {
  const response = await api.get("/staff/search", {
    params: { query },
  });
  return response.data;
};

/**
 * Fetch staff by role
 */
export const fetchStaffByRole = async (role: "admin" | "staff"): Promise<Staff[]> => {
  const response = await api.get(`/staff/role/${role}`);
  return response.data;
};
