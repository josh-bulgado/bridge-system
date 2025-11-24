export interface Document {
  id: string;
  name: string;
  price: number;
  requirements: string[];
  status: "Active" | "Inactive";
  processingTime: string;
  templateUrl: string;
  totalRequests: number;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  name: string;
  price: number;
  requirements: string[];
  status: "Active" | "Inactive";
  processingTime: string;
  templateUrl: string;
}

export interface UpdateDocumentRequest {
  name?: string;
  price?: number;
  requirements?: string[];
  status?: "Active" | "Inactive";
  processingTime?: string;
  templateUrl?: string;
}

export interface ToggleDocumentStatusRequest {
  status: "Active" | "Inactive";
}
