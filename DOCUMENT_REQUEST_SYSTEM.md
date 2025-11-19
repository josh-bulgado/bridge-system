# Document Request System

## Overview
A comprehensive document request management system for barangay residents to request and track various barangay documents (certificates, clearances, permits, IDs).

## Features Implemented

### Backend (C# .NET)

#### Models
- **DocumentRequest** (`server/src/Models/DocumentRequest.cs`)
  - Complete request lifecycle management
  - Status tracking with history
  - Payment integration
  - Document upload support
  - Pickup scheduling
  
- **DocumentType** (`server/src/Models/DocumentType.cs`)
  - Configurable document types
  - Pricing and processing time
  - Required documents list
  - Active/inactive status

#### Services
- **DocumentRequestService** (`server/src/Services/DocumentRequestService.cs`)
  - CRUD operations for requests
  - Request number generation (REQ-YYYY-###)
  - Status management
  - Statistics calculation
  - Filtering by user, status, assignment
  
- **DocumentTypeService** (`server/src/Services/DocumentTypeService.cs`)
  - Document type management
  - Default types initialization
  - Category filtering

#### Controllers
- **DocumentRequestController** (`server/src/Controllers/DocumentRequestController.cs`)
  - Resident endpoints (create, view requests, statistics)
  - Staff endpoints (update status, assign, schedule pickup)
  - Role-based access control
  
- **DocumentTypeController** (`server/src/Controllers/DocumentTypeController.cs`)
  - Public endpoints for active document types
  - Admin endpoints for management
  
- **SeedController** (`server/src/Controllers/SeedController.cs`)
  - Initialize default document types

### Frontend (React + TypeScript)

#### Services
- **documentRequestService.ts** (`client/src/features/resident/services/`)
  - API integration for document requests
  - TypeScript interfaces for type safety

#### Hooks
- **useDocumentRequests** - Manage requests and statistics
- **useDocumentTypes** - Fetch available document types

#### Pages
1. **NewRequestPage** - Submit new document requests
   - Document type selection
   - Purpose input
   - Quantity selection
   - Price calculation
   - Required documents display

2. **RequestsPage** - View all requests
   - Search functionality
   - Status filtering
   - Request listing with badges

3. **RequestDetailsPage** - View request details
   - Complete request information
   - Status history timeline
   - Payment information
   - Required documents

4. **ResidentDashboard** (Updated)
   - Real-time statistics from API
   - Recent requests display
   - Quick action buttons with navigation

## Default Document Types

1. **Barangay Clearance** (BC)
   - Price: ₱50.00
   - Processing: 3 days
   - Required: Valid ID, Proof of Residency

2. **Certificate of Residency** (CR)
   - Price: ₱30.00
   - Processing: 2 days
   - Required: Valid ID

3. **Certificate of Indigency** (CI)
   - Price: Free
   - Processing: 3 days
   - Required: Valid ID, Proof of Income

4. **Business Permit** (BP)
   - Price: ₱500.00
   - Processing: 7 days
   - Required: Valid ID, Business Documents, Location Map

5. **Barangay ID** (BID)
   - Price: ₱100.00
   - Processing: 5 days
   - Required: Valid ID, 1x1 Photo, Proof of Residency

6. **Certificate of Good Moral** (CGM)
   - Price: ₱30.00
   - Processing: 3 days
   - Required: Valid ID

## Request Status Flow

1. **Pending** - Initial status when request is submitted
2. **Processing** - Staff is working on the request
3. **Action Required** - Resident needs to provide additional information
4. **Ready for Pickup** - Document is ready to be collected
5. **Completed** - Request successfully fulfilled
6. **Rejected** - Request denied with reason

## API Endpoints

### Resident Endpoints
- `GET /api/DocumentRequest/my-requests` - Get user's requests
- `GET /api/DocumentRequest/my-statistics` - Get user's statistics
- `GET /api/DocumentRequest/{id}` - Get request details
- `POST /api/DocumentRequest` - Create new request
- `GET /api/DocumentType/active` - Get available document types

### Staff/Admin Endpoints
- `GET /api/DocumentRequest` - Get all requests
- `GET /api/DocumentRequest/statistics` - Get system statistics
- `GET /api/DocumentRequest/status/{status}` - Filter by status
- `PUT /api/DocumentRequest/{id}/status` - Update request status
- `PUT /api/DocumentRequest/{id}/assign` - Assign to staff
- `PUT /api/DocumentRequest/{id}/payment-status` - Update payment
- `PUT /api/DocumentRequest/{id}/schedule-pickup` - Schedule pickup
- `PUT /api/DocumentRequest/{id}/reject` - Reject request
- `DELETE /api/DocumentRequest/{id}` - Delete request (admin only)

### Document Type Management (Admin)
- `GET /api/DocumentType` - Get all document types
- `POST /api/DocumentType` - Create new document type
- `PUT /api/DocumentType/{id}` - Update document type
- `DELETE /api/DocumentType/{id}` - Delete document type
- `PUT /api/DocumentType/{id}/activate` - Activate type
- `PUT /api/DocumentType/{id}/deactivate` - Deactivate type

### Seed Data
- `POST /api/Seed/document-types` - Initialize default types

## Setup Instructions

### Backend Setup
1. Services are registered in `Program.cs`:
   ```csharp
   builder.Services.AddSingleton<DocumentRequestService>();
   builder.Services.AddSingleton<DocumentTypeService>();
   ```

2. Initialize default document types (run once):
   ```bash
   POST http://localhost:5000/api/Seed/document-types
   ```

### Frontend Setup
1. Routes are configured in `App.tsx`:
   - `/resident/new-request` - New request form
   - `/resident/requests` - All requests list
   - `/resident/requests/:id` - Request details

2. Dashboard automatically fetches real data on load

## Dependencies
- MongoDB for data storage
- JWT authentication for security
- React Query for data fetching
- date-fns for date formatting
- Axios for API calls

## Security Features
- Role-based access control (resident, staff, admin)
- JWT token authentication
- Resident verification requirement for certain documents
- Request ownership validation

## Future Enhancements
- File upload for documents
- Email notifications
- SMS notifications
- Payment gateway integration
- QR code for pickup verification
- Request cancellation
- Request modification
- Document preview/download
- Staff assignment automation
- Analytics and reporting
