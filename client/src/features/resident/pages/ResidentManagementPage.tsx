import { Input } from "@/components/ui/input";
import ResidentListTable from "../components/ResidentListTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResidentManagementPage = () => {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resident Management
          </h1>
          <p className="text-muted-foreground">
            Manage resident registrations, verifications, and account status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="ring-offset-background focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            Export Data
          </button>
          <button className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            Add New Resident
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search residents by name, email, or address..."
          />

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Email Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Email Status</SelectItem>
              <SelectItem value="verified">Email Verified</SelectItem>
              <SelectItem value="unverified">Email Unverified</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Registration Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Registration Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>Showing 5 of 234 residents</span>
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ResidentListTable />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              Next
            </button>
          </div>
          <span className="text-muted-foreground text-sm">Page 1 of 24</span>
        </div>
      </div>
    </div>
  );
};

export default ResidentManagementPage;
