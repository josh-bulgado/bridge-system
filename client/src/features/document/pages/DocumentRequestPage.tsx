import { columns } from "../components/DocumentRequestDataColumn";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchDocumentRequests } from "../hooks";
import { DocumentRequestDataTable } from "../components/DocumentRequestDataTable";

const DocumentRequestPage = () => {
  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useFetchDocumentRequests();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Requests
          </h1>
          <p className="text-muted-foreground">
            Review and manage resident document requests
          </p>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading document requests...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <span className="text-red-500">
            Error loading document requests. Please try again.
          </span>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DocumentRequestDataTable data={requests} columns={columns} isLoading={isLoading} />
        // <DataTable
        //   columns={columns}
        //   data={requests}
        //   itemLabel="document requests"
        //   emptyMessage="No document requests found."
        //   enableRowSelection={false}
        //   toolbar={(table) => ({
        //     searchSlot: (
        //       <div className="relative w-full max-w-sm">
        //         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        //         <Input
        //           placeholder="Search by tracking number..."
        //           value={(table.getColumn("trackingNumber")?.getFilterValue() as string) ?? ""}
        //           onChange={(e) =>
        //             table.getColumn("trackingNumber")?.setFilterValue(e.target.value)
        //           }
        //           className="pl-8"
        //         />
        //       </div>
        //     ),
        //     filterSlots: [
        //       <Select
        //         key="status"
        //         value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
        //         onValueChange={(value) =>
        //           table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        //         }
        //       >
        //         <SelectTrigger className="w-[200px]">
        //           <SelectValue placeholder="Filter by status" />
        //         </SelectTrigger>
        //         <SelectContent>
        //           <SelectItem value="all">All Statuses</SelectItem>
        //           <SelectItem value="pending">Pending Review</SelectItem>
        //           <SelectItem value="approved">Approved</SelectItem>
        //           <SelectItem value="rejected">Rejected</SelectItem>
        //           <SelectItem value="payment_pending">Payment Pending</SelectItem>
        //           <SelectItem value="payment_verified">Payment Verified</SelectItem>
        //           <SelectItem value="ready_for_generation">
        //             Ready for Generation
        //           </SelectItem>
        //           <SelectItem value="completed">Completed</SelectItem>
        //         </SelectContent>
        //       </Select>,
        //     ],
        //   })}
        // />
      )}
    </div>
  );
};

export default DocumentRequestPage;
