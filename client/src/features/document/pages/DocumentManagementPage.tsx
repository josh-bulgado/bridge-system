import { DocumentDataTable } from "../components/DocumentDataTable";

// Sample document data
const documentData = [
  {
    id: 1,
    name: "Barangay Clearance",
    description: "Certificate of good moral character and residence",
    price: 50.00,
    requirements: ["Valid ID", "Proof of Residency", "Barangay ID Photo"],
    status: "Active",
    processingTime: "1-2 business days",
    totalRequests: 156,
    lastModified: "2024-03-20",
  },
  {
    id: 2,
    name: "Certificate of Indigency",
    description: "Document certifying low-income status for various purposes",
    price: 30.00,
    requirements: ["Valid ID", "Proof of Residency", "Income Statement", "Barangay ID Photo"],
    status: "Active",
    processingTime: "2-3 business days",
    totalRequests: 89,
    lastModified: "2024-02-28",
  },
  {
    id: 3,
    name: "Business Permit",
    description: "Permit for operating small businesses within barangay",
    price: 200.00,
    requirements: ["Valid ID", "Business Plan", "Proof of Location", "Tax Clearance", "Barangay ID Photo"],
    status: "Active",
    processingTime: "5-7 business days",
    totalRequests: 34,
    lastModified: "2024-03-15",
  },
  {
    id: 4,
    name: "Residency Certificate",
    description: "Official proof of residence within the barangay",
    price: 25.00,
    requirements: ["Valid ID", "Proof of Residency", "Barangay ID Photo"],
    status: "Inactive",
    processingTime: "1-2 business days",
    totalRequests: 67,
    lastModified: "2024-03-10",
  },
  {
    id: 5,
    name: "Complaint Certificate",
    description: "Document for filing complaints or legal matters",
    price: 75.00,
    requirements: ["Valid ID", "Incident Report", "Witness Statements", "Supporting Documents", "Barangay ID Photo"],
    status: "Active",
    processingTime: "3-5 business days",
    totalRequests: 23,
    lastModified: "2024-03-18",
  },
];

const DocumentManagementPage = () => {
  return (
    <div className="space-y-6 px-4 lg:px-6 flex flex-col ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Management
          </h1>
          <p className="text-muted-foreground">
            Manage barangay documents, pricing, requirements, and availability
          </p>
        </div>
      </div>

      <DocumentDataTable data={documentData} />
    </div>
  );
};

export default DocumentManagementPage;
