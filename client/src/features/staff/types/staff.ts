export interface Staff {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "staff" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  residentId?: string;
  authProvider: "local" | "google";
  googleId?: string;
}

export interface CreateStaffRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "staff" | "admin";
  isActive?: boolean;
}

export interface UpdateStaffRequest {
  email?: string;
  role?: "staff" | "admin";
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface ToggleStaffStatusRequest {
  isActive: boolean;
}

export interface UpdateStaffRoleRequest {
  role: "staff" | "admin";
}
