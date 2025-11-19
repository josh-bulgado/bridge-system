# Verification System Documentation

## Overview
The verification system has been refactored into smaller, reusable components with proper separation of concerns. The system uses Zod for validation, React Hook Form for form management, and follows a clean architecture pattern.

## Architecture

### Client-Side Structure

```
client/src/features/resident/
├── components/
│   ├── FileUploadZone.tsx              # Reusable file upload component with drag & drop
│   ├── VerificationHeader.tsx          # Page header with navigation
│   ├── AddressInformationSection.tsx   # Address form fields
│   ├── DocumentUploadSection.tsx       # Document upload fields
│   ├── VerificationSuccessScreen.tsx   # Success message screen
│   └── VerificationForm.tsx            # Main form container
├── hooks/
│   ├── useVerification.ts              # Main verification logic hook
│   └── useFileUpload.ts                # File upload state management hook
├── schemas/
│   └── verificationSchema.ts           # Zod validation schemas
├── services/
│   └── verificationService.ts          # API service layer
└── pages/
    └── VerificationPage.tsx            # Main page component (refactored)
```

### Server-Side Structure

```
server/src/
├── Controllers/
│   └── ResidentController.cs           # API endpoints for verification
├── Services/
│   └── ResidentService.cs              # Business logic for verification
├── Models/
│   └── Resident.cs                     # Updated with verification fields
└── DTOs/Residents/
    ├── SubmitVerificationRequest.cs    # Request DTO
    └── VerificationResponse.cs         # Response DTOs
```

## Components

### 1. FileUploadZone
A reusable file upload component with drag-and-drop functionality.

**Props:**
- `accept`: File types to accept (e.g., "image/*")
- `label`: Display label
- `description`: Helper text
- `uploaded`: Current uploaded file
- `uploading`: Upload in progress
- `onUpload`: Upload handler
- `onRemove`: Remove handler

**Features:**
- Drag and drop support
- File size validation (5MB limit)
- Visual upload progress
- Success state with file preview
- Remove uploaded file

### 2. VerificationHeader
Page header with back navigation and title.

**Props:**
- `onBack`: Navigation callback

### 3. AddressInformationSection
Form section for address details.

**Props:**
- `form`: React Hook Form instance

**Fields:**
- House Number/Unit
- Street/Purok

### 4. DocumentUploadSection
Form section for document uploads.

**Props:**
- `form`: React Hook Form instance
- Upload states and handlers for each document

**Documents:**
- Government ID (Front)
- Government ID (Back)
- Proof of Residency

### 5. VerificationForm
Main form container with all sections.

**Props:**
- All form state and handlers

### 6. VerificationSuccessScreen
Success message displayed after submission.

**Props:**
- `onBackToDashboard`: Navigation callback

## Hooks

### useVerification()
Main hook for verification form logic.

**Returns:**
- `form`: React Hook Form instance
- `isSubmitted`: Submission success state
- `isSubmitting`: Submission in progress
- `onSubmit`: Form submission handler
- `handleBackToDashboard`: Navigation handler

**Features:**
- Form initialization with Zod schema
- API integration
- Error handling
- Success state management

### useFileUpload()
Hook for managing file upload state.

**Returns:**
- Upload states for each document
- `handleFileUpload`: Upload handler
- `removeFile`: Remove file handler

**Features:**
- File size validation
- Upload progress tracking
- Error handling
- State management for multiple files

## Schemas

### verificationSchema
Zod schema for form validation.

**Fields:**
- `streetPurok`: Required string
- `houseNumberUnit`: Required string
- `governmentIdFront`: Required URL string
- `governmentIdBack`: Required URL string
- `proofOfResidency`: Required URL string

### fileUploadSchema
Zod schema for file validation.

**Validation:**
- File size: Max 5MB
- File types: Images (JPEG, PNG, GIF) and PDF

## Services

### verificationService
API service for verification operations.

**Methods:**

#### uploadFile(file: File)
Upload a file to the server.

**Returns:** `UploadedFile`
```typescript
{
  url: string;
  name: string;
  size: number;
}
```

#### submitVerification(data: VerificationSubmissionData)
Submit verification request.

**Returns:** `VerificationResponse`
```typescript
{
  id: string;
  status: string;
  message: string;
  submittedAt: string;
}
```

#### getVerificationStatus()
Get current verification status.

**Returns:** `VerificationStatusResponse`
```typescript
{
  isVerified: boolean;
  status: string;
  submittedAt?: string;
}
```

## API Endpoints

### POST /api/Resident/verification
Submit verification request with documents.

**Authorization:** Required (JWT, Resident role)

**Request Body:**
```json
{
  "streetPurok": "string",
  "houseNumberUnit": "string",
  "governmentIdFront": "string (URL)",
  "governmentIdBack": "string (URL)",
  "proofOfResidency": "string (URL)"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "Pending",
  "message": "Verification request submitted successfully",
  "submittedAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/Resident/verification/status
Get verification status for current user.

**Authorization:** Required (JWT, Resident role)

**Response:**
```json
{
  "isVerified": false,
  "status": "Pending",
  "submittedAt": "2024-01-01T00:00:00Z",
  "verifiedAt": null,
  "verifiedBy": null
}
```

## Database Schema Updates

### Resident Model
Added new fields:

```csharp
// Address
public class Address {
    public string? StreetPurok { get; set; }
    public string? HouseNumberUnit { get; set; }
    // ... existing fields
}

// Verification Documents
public class VerificationDocuments {
    public string? GovernmentIdFront { get; set; }
    public string? GovernmentIdBack { get; set; }
    public string? ProofOfResidency { get; set; }
    public DateTime SubmittedAt { get; set; }
}
```

## Usage Example

### Basic Usage
```typescript
import VerificationPage from "@/features/resident/pages/VerificationPage";

// In your router
<Route path="/resident/verification" element={<VerificationPage />} />
```

### Using Individual Components
```typescript
import { FileUploadZone, useFileUpload } from "@/features/resident";

const MyComponent = () => {
  const { handleFileUpload, uploadedIdFront, uploadingIdFront } = useFileUpload();
  
  return (
    <FileUploadZone
      accept="image/*"
      label="Upload Document"
      description="Upload your document"
      uploaded={uploadedIdFront}
      uploading={uploadingIdFront}
      onUpload={(file) => handleFileUpload(file, setUploadedIdFront, setUploadingIdFront, onChange)}
      onRemove={() => removeFile(setUploadedIdFront, onChange)}
    />
  );
};
```

## Benefits of Refactoring

1. **Reusability**: Components can be used in other parts of the application
2. **Maintainability**: Easier to update and fix bugs
3. **Testability**: Each component and hook can be tested independently
4. **Separation of Concerns**: Clear separation between UI, logic, and data
5. **Type Safety**: Full TypeScript support with Zod validation
6. **Scalability**: Easy to extend with new features

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { FileUploadZone } from './FileUploadZone';

test('renders upload zone', () => {
  render(<FileUploadZone {...props} />);
  expect(screen.getByText('Drag and drop file here')).toBeInTheDocument();
});
```

### Hook Testing
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useVerification } from './useVerification';

test('handles form submission', async () => {
  const { result } = renderHook(() => useVerification());
  await act(async () => {
    await result.current.onSubmit(mockData);
  });
  expect(result.current.isSubmitted).toBe(true);
});
```

## Future Enhancements

1. Add file preview for uploaded documents
2. Implement progress bar for uploads
3. Add document validation (OCR for ID verification)
4. Support multiple file formats
5. Add document compression before upload
6. Implement retry logic for failed uploads
7. Add real-time verification status updates
8. Email notifications for verification status changes

## Support

For issues or questions, please contact the development team.
