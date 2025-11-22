import { useState, useEffect } from "react";
import { DocumentDataTable } from "../components/DocumentDataTable";
import { columns } from "../components/DocumentDataColumn";
import { Loader2 } from "lucide-react";

// Sample function to fetch document data asynchronously
async function getDocumentData() {
  // Fetch data from your API here or mock it
  return [
    {
      id: "728ed52f",
      name: "Barangay Clearance",
      price: 50.0,
      requirements: ["Valid ID", "Proof of Residency", "Barangay ID Photo"],
      status: "Active",
      processingTime: "1-2 business days",
      totalRequests: 156,
      lastModified: "2024-03-20",
    },
    {
      id: "84fd32df",
      name: "Certificate of Indigency",
      price: 30.0,
      requirements: [
        "Valid ID",
        "Proof of Residency",
        "Income Statement",
        "Barangay ID Photo",
      ],
      status: "Inactive",
      processingTime: "2-3 business days",
      totalRequests: 89,
      lastModified: "2024-02-28",
    },
    // More documents here...
  ];
}

const DocumentManagementPage = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch document data when the component mounts
    const fetchData = async () => {
      const data = await getDocumentData();
      setDocuments(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddDocument = (document: any) => {
    // Generate a unique ID for the new document
    const newDocument = {
      ...document,
      id: Math.random().toString(36).substring(2, 15),
      totalRequests: 0,
      lastModified: new Date().toISOString().split('T')[0],
    };
    
    // Add the new document to the list
    setDocuments([...documents, newDocument]);
  };

  return (
    <div className="flex flex-col space-y-6 px-4 lg:px-6">
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

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8" />
          <span>Loading documents...</span>
        </div>
      ) : (
        <DocumentDataTable 
          data={documents} 
          columns={columns} 
          onAddDocument={handleAddDocument}
        />
      )}
    </div>
  );
};

export default DocumentManagementPage;
