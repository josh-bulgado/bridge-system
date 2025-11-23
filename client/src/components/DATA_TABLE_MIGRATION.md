****# DataTable Component - Migration Guide

## Overview

The reusable `DataTable` component has been created to eliminate code duplication across the application. All feature-specific data tables should now use this component.

## ✅ Completed Migrations

- **DocumentRequestPage**: ✅ Migrated to use reusable DataTable

## 🔄 Pending Migrations

### 1. DocumentDataTable
**Location**: `client/src/features/document/components/DocumentDataTable.tsx`

**Current Issues**:
- 325 lines of duplicated code
- Custom implementation of table logic
- Has bulk delete functionality

**Migration Steps**:

```tsx
// BEFORE (DocumentManagementPage.tsx)
import { DocumentDataTable } from "../components/DocumentDataTable";

<DocumentDataTable columns={columns} data={documents} />

// AFTER
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddDocumentSheet } from "../components/AddDocumentSheet";

const [selectedDocuments, setSelectedDocuments] = React.useState([]);

<DataTable
  columns={columns}
  data={documents}
  itemLabel="documents"
  enableRowSelection={true}
  onRowSelectionChange={setSelectedDocuments}
  toolbar={(table) => ({
    searchSlot: (
      <Input
        placeholder="Search documents..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
        className="max-w-sm"
      />
    ),
    filterSlots: [
      <Select
        key="status"
        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    ],
    actionSlots: [<AddDocumentSheet key="add" />]
  })}
  headerSlot={
    selectedDocuments.length > 0 && (
      <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
        <span className="text-sm font-medium">
          {selectedDocuments.length} document(s) selected
        </span>
        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </div>
    )
  }
/>
```

**Files to Delete After Migration**:
- `client/src/features/document/components/DocumentDataTable.tsx`

---

### 2. StaffDataTable
**Location**: `client/src/features/staff/components/StaffDataTable.tsx`

**Current Issues**:
- 334 lines of duplicated code
- Custom implementation
- Has bulk delete with icon button

**Migration Steps**:

```tsx
// BEFORE (StaffManagementPage.tsx)
import { StaffDataTable } from "../components/StaffDataTable";

<StaffDataTable columns={columns} data={staff} />

// AFTER
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddStaffSheet } from "../components/AddStaffSheet";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const [selectedStaff, setSelectedStaff] = React.useState([]);

<DataTable
  columns={columns}
  data={staff}
  itemLabel="staff members"
  enableRowSelection={true}
  onRowSelectionChange={setSelectedStaff}
  toolbar={(table) => ({
    searchSlot: (
      <Input
        placeholder="Search by email..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
        className="max-w-sm"
      />
    ),
    filterSlots: [
      <Select
        key="role"
        value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
        </SelectContent>
      </Select>,
      <Select
        key="status"
        value={(table.getColumn("isActive")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table.getColumn("isActive")?.setFilterValue(value === "all" ? "" : value === "true")
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
    ],
    actionSlots: [
      <AddStaffSheet key="add" />,
      <Button
        key="delete"
        variant="outline"
        size="icon"
        onClick={handleBulkDelete}
        disabled={selectedStaff.length === 0}
        className={selectedStaff.length > 0 ? "hover:bg-red-50 hover:text-red-500" : ""}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ]
  })}
/>
```

**Files to Delete After Migration**:
- `client/src/features/staff/components/StaffDataTable.tsx`

---

### 3. ResidentDataTable
**Location**: `client/src/features/resident/components/ResidentDataTable.tsx`

**Current Issues**:
- 288 lines of duplicated code
- Uses global filter for search across multiple columns
- No bulk actions

**Migration Steps**:

```tsx
// BEFORE (ResidentManagementPage.tsx)
import { ResidentDataTable } from "../components/ResidentDataTable";

<ResidentDataTable columns={columns} data={residents} />

// AFTER
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<DataTable
  columns={columns}
  data={residents}
  itemLabel="residents"
  enableGlobalFilter={true}
  globalFilterFn={(row, columnId, filterValue) => {
    const searchValue = filterValue.toLowerCase();
    const fullName = row.getValue("fullName") as string;
    const email = row.getValue("email") as string;
    const localAddress = row.getValue("localAddress") as string;

    return (
      fullName?.toLowerCase().includes(searchValue) ||
      email?.toLowerCase().includes(searchValue) ||
      localAddress?.toLowerCase().includes(searchValue)
    );
  }}
  toolbar={(table) => ({
    searchSlot: (
      <Input
        placeholder="Search by name, email, or address..."
        value={(table.getState().globalFilter as string) ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="h-10 w-[250px] lg:w-[350px]"
      />
    ),
    filterSlots: [
      <Select
        key="verification"
        value={(table.getColumn("verificationStatus")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table.getColumn("verificationStatus")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
        </SelectContent>
      </Select>,
      <Select
        key="email"
        value={(table.getColumn("isEmailVerified")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) => {
          if (value === "all") {
            table.getColumn("isEmailVerified")?.setFilterValue(undefined);
          } else {
            table.getColumn("isEmailVerified")?.setFilterValue(value === "verified");
          }
        }}
      >
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="Email Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Email Status</SelectItem>
          <SelectItem value="verified">Email Verified</SelectItem>
          <SelectItem value="unverified">Email Unverified</SelectItem>
        </SelectContent>
      </Select>
    ]
  })}
/>
```

**Files to Delete After Migration**:
- `client/src/features/resident/components/ResidentDataTable.tsx`

---

## Benefits of Migration

### Code Reduction
- **Before**: ~950 lines of duplicated table code
- **After**: ~300 lines total (1 reusable component + configs)
- **Savings**: ~650 lines of code

### Maintainability
- Fix bugs in one place
- Add features to all tables at once
- Consistent behavior across all tables

### Consistency
- Same UX patterns everywhere
- Same styling and interactions
- Predictable behavior for users

### Type Safety
- Full TypeScript support
- Better autocomplete
- Catch errors at compile time

## Key Features of Reusable DataTable

1. **Flexible Toolbar**: Pass functions to access table instance
2. **Multiple Filter Types**: Column filters, global filter, custom filters
3. **Row Selection**: Optional with callback support
4. **Custom Slots**: headerSlot for bulk actions, toolbar slots for custom UI
5. **Pagination**: Configurable page sizes
6. **Empty States**: Customizable messages
7. **Column Visibility**: Built-in toggle
8. **Sorting**: Automatic on all columns
9. **Responsive**: Mobile-friendly design

## Testing Checklist

After migrating each table, test:

- [ ] Search/filter functionality works
- [ ] Sorting works on all columns
- [ ] Pagination works correctly
- [ ] Column visibility toggle works
- [ ] Row selection works (if enabled)
- [ ] Empty state displays correctly
- [ ] Bulk actions work (if applicable)
- [ ] Responsive design on mobile
- [ ] No console errors
- [ ] TypeScript compiles without errors

## Common Patterns

### Pattern 1: Simple Column Filter
```tsx
<Select
  value={(table.getColumn("columnName")?.getFilterValue() as string) ?? "all"}
  onValueChange={(value) =>
    table.getColumn("columnName")?.setFilterValue(value === "all" ? "" : value)
  }
>
  {/* options */}
</Select>
```

### Pattern 2: Global Search
```tsx
enableGlobalFilter={true}
globalFilterFn={(row, columnId, filterValue) => {
  const searchValue = filterValue.toLowerCase();
  const field1 = row.getValue("field1") as string;
  const field2 = row.getValue("field2") as string;
  
  return (
    field1?.toLowerCase().includes(searchValue) ||
    field2?.toLowerCase().includes(searchValue)
  );
}}

// In toolbar:
searchSlot: (
  <Input
    value={(table.getState().globalFilter as string) ?? ""}
    onChange={(e) => table.setGlobalFilter(e.target.value)}
  />
)
```

### Pattern 3: Bulk Actions with Header Slot
```tsx
headerSlot={
  selectedRows.length > 0 && (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
      <span>{selectedRows.length} selected</span>
      <Button onClick={handleBulkAction}>Action</Button>
    </div>
  )
}
```

### Pattern 4: Boolean Filter
```tsx
<Select
  value={(table.getColumn("isActive")?.getFilterValue() as string) ?? "all"}
  onValueChange={(value) =>
    table.getColumn("isActive")?.setFilterValue(value === "all" ? "" : value === "true")
  }
>
  <SelectItem value="all">All</SelectItem>
  <SelectItem value="true">Active</SelectItem>
  <SelectItem value="false">Inactive</SelectItem>
</Select>
```

## Next Steps

1. Migrate DocumentDataTable
2. Migrate StaffDataTable  
3. Migrate ResidentDataTable
4. Delete old component files
5. Update any imports across the codebase
6. Run full test suite

## Questions or Issues?

If you encounter any issues during migration, check:
1. Column IDs match what's used in filters
2. Filter values are correctly typed (string, boolean, etc.)
3. Table instance is properly accessed in toolbar function
4. All required props are passed to DataTable component
