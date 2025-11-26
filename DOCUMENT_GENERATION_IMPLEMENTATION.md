# Document Generation Implementation Summary

## Overview
Implemented a document generation system for staff/admin to generate official documents (Barangay Clearance, Indigency Certificate, Residency Certificate) from DOCX templates with auto-filled resident data.

## ✅ Completed Backend Implementation

### 1. **Added Civil Status Field**
- **Location**: `server/src/Models/Resident.cs`
- **Field**: `CivilStatus` (nullable string)
- **Values**: Single, Married, Widowed, Divorced, Separated
- **Migration Strategy**: Nullable field - existing records will have null, staff fills during document generation

### 2. **Updated Registration Flow**
- **Files Modified**:
  - `server/src/DTOs/Auth/RegisterRequest.cs` - Added civilStatus validation
  - `server/src/DTOs/Auth/CompleteGoogleProfileRequest.cs` - Added civilStatus (optional)
  - `server/src/Controllers/AuthController.cs` - Updated both registration methods

### 3. **Document Generation Service**
- **Location**: `server/src/Services/DocumentGenerationService.cs`
- **Dependencies**:
  - `DocumentFormat.OpenXml` (v3.0.2) - for DOCX manipulation
  - `DocX` (v2.5.0) - installed but using OpenXML SDK instead

**Key Methods**:
```csharp
// Generate preview data with all placeholders filled
Task<Dictionary<string, string>> GeneratePreviewDataAsync(string documentRequestId)

// Generate final document and upload to Cloudinary
Task<string> GenerateDocumentAsync(string documentRequestId, Dictionary<string, string> data, string generatedBy)
```

**Placeholder Mapping**:
| Placeholder | Source | Notes |
|------------|--------|-------|
| `<<FULL_NAME>>` | Resident.FullName | Computed property |
| `<<AGE>>` | Calculated from DateOfBirth | Auto-calculated |
| `<<CIVIL_STATUS>>` / `<<MARITAL_STATUS>>` | Resident.CivilStatus | Required during generation |
| `<<PROVINCE>>` | BarangayConfig.Address.ProvinceName | From config |
| `<<MUNICIPALITY>>` | BarangayConfig.Address.MunicipalityName | From config |
| `<<BARANGAY_NAME>>` | BarangayConfig.Address.BarangayName | From config |
| `<<CAPTAIN_NAME>>` | BarangayConfig.BarangayCaptain | From config |
| `<<DATE>>` | Current date | Format: "MMMM dd, yyyy" |
| `<<DAY>>` | Current day | Numeric |
| `<<MONTH>>` | Current month | Full name |
| `<<YEAR>>` | Current year | Numeric |
| `<<OR_NO>>` | Auto-generated | Format: OR-2025-00001 |
| `<<PURPOSE>>` | DocumentRequest.Purpose | From request |

**Features**:
- Downloads template from Cloudinary
- Replaces text placeholders using OpenXML
- Replaces barangay logo image at rId4
- Generates auto-incremented OR numbers (OR-YYYY-XXXXX)
- Uploads generated DOCX to Cloudinary
- Updates document request status to "completed"
- Adds status history tracking

### 4. **API Endpoints**
- **Location**: `server/src/Controllers/DocumentRequestController.cs`

**New Endpoints**:
```csharp
POST /api/document-requests/{id}/generate-preview
// Returns preview data for review

POST /api/document-requests/{id}/generate-document
// Generates and uploads document
// Request body: { data: { "FULL_NAME": "...", "AGE": "...", ... } }
```

**Authorization**: Both endpoints require `staff` or `admin` role

### 5. **DTOs**
- `server/src/DTOs/DocumentRequests/GeneratePreviewRequest.cs`
- `server/src/DTOs/DocumentRequests/GenerateDocumentRequest.cs`

### 6. **Service Registration**
- **Location**: `server/Program.cs`
- Added `DocumentGenerationService` to DI container

---

## ✅ Completed Frontend Implementation

### 1. **Updated Registration Form**
- **Location**: `client/src/features/auth/components/StepPersonalInfo.tsx`
- Added Civil Status dropdown (required field)
- **Location**: `client/src/features/auth/schemas/registerSchema.ts`
- Added civilStatus validation

### 2. **Document Generation Service**
- **Location**: `client/src/features/document/services/documentGenerationService.ts`
- Axios-based API calls for preview and generation

### 3. **Custom Hooks**
- **Location**: `client/src/features/document/hooks/`

**useGeneratePreview.ts**:
```typescript
const generatePreview = useGeneratePreview();
generatePreview.mutate(documentRequestId);
```

**useGenerateDocument.ts**:
```typescript
const generateDocument = useGenerateDocument();
generateDocument.mutate({ documentRequestId, data: editedData });
```

### 4. **Document Generation Modal**
- **Location**: `client/src/features/document/components/DocumentGenerationModal.tsx`

**Features**:
- Loads preview data when opened
- Displays editable form with all document fields
- Required fields marked with red asterisk
- Read-only fields (from config) shown with gray background
- Civil Status dropdown for easy selection
- Validation before generation
- Loading states for preview and generation
- Success animation on completion
- Auto-closes after successful generation

**UI Flow**:
1. **Loading** - Fetches preview data
2. **Editing** - Shows editable form with pre-filled data
3. **Generating** - Shows progress indicator
4. **Success** - Shows success message and auto-closes

---

## 📋 Status Flow

```
Pending → Payment Verified → Processing → Completed → Released
```

- **Payment Verified**: Ready for document generation
- **Processing**: Document generation in progress
- **Completed**: Document generated and ready for pickup
- **Released**: Resident has claimed the document

---

## 🔧 Technical Details

### Document Processing
- Uses **DocumentFormat.OpenXml** for DOCX manipulation
- Reads template from Cloudinary URL
- Replaces text placeholders in document body
- Replaces image at specific relationship ID (rId4)
- Saves modified document temporarily
- Uploads to Cloudinary as DOCX (PDF conversion can be added later)

### Image Replacement
- Finds existing image part by relationship ID
- Downloads barangay logo from Cloudinary
- Replaces image data in the DOCX package
- Maintains original image dimensions

### OR Number Generation
- Format: `OR-{YEAR}-{SEQUENTIAL}`
- Example: `OR-2025-00001`
- Auto-increments based on last generated document
- Sequential per year

---

## 🎯 Usage Instructions

### For Staff/Admin:

1. **Navigate to Document Requests** (Staff Dashboard)
2. **Find request with status "Payment Verified"**
3. **Click "Generate Document" button**
4. **Review Modal Opens**:
   - All fields pre-filled with resident data
   - Edit any field if needed (especially Civil Status if resident has none)
   - Required fields: Full Name, Age, Civil Status
5. **Click "Generate Document"**
6. **Wait for processing** (document is generated and uploaded)
7. **Success!** - Status changes to "Completed"

### For Existing Residents (without Civil Status):
- Staff will be prompted to fill Civil Status during document generation
- Field will be highlighted/required in the modal
- Once filled, it's used for that document generation
- Resident can update their profile later in settings

---

## 🚀 Future Enhancements

### Immediate Next Steps:
1. **Add "Generate Document" button** to DocumentRequestDataTable actions
2. **Integrate modal** into Staff/Admin document request management page
3. **Add PDF conversion** (using library like Syncfusion or Aspose)
4. **Add document preview** before final generation
5. **Add settings page field** for residents to update civil status

### Advanced Features:
- Support for multiple document templates
- Template version management
- Document regeneration capability
- Digital signature integration
- QR code for verification
- Email delivery of generated documents
- Bulk document generation

---

## 📦 Dependencies Added

### Backend:
```xml
<PackageReference Include="DocumentFormat.OpenXml" Version="3.0.2" />
<PackageReference Include="DocX" Version="2.5.0" />
```

### Frontend:
No new dependencies (uses existing TanStack Query, Axios, shadcn/ui)

---

## 🧪 Testing Checklist

### Backend:
- [x] Backend compiles successfully
- [ ] Test generate-preview endpoint
- [ ] Test generate-document endpoint
- [ ] Test with resident without civil status
- [ ] Test with different document types
- [ ] Test OR number generation
- [ ] Test image replacement

### Frontend:
- [ ] Registration form shows civil status field
- [ ] Modal opens and loads preview data
- [ ] All fields are editable/read-only as designed
- [ ] Validation works for required fields
- [ ] Document generation succeeds
- [ ] Success message displays
- [ ] Modal closes automatically
- [ ] Document request list refreshes

---

## 📝 Notes

- **DOCX vs PDF**: Currently generates DOCX files. PDF conversion can be added later using appropriate library.
- **Image Logo**: Template must have an image with relationship ID "rId4" for logo replacement to work.
- **Template Structure**: Templates should use `<<PLACEHOLDER>>` format for text replacement.
- **Existing Records**: Residents registered before this update will have null civil status - staff will fill during generation.
- **Address Format**: Uses barangay-level address only (not including street/purok).

---

## 🔗 Related Files

### Backend:
- Models: `server/src/Models/Resident.cs`, `DocumentRequest.cs`
- Services: `server/src/Services/DocumentGenerationService.cs`
- Controllers: `server/src/Controllers/DocumentRequestController.cs`
- DTOs: `server/src/DTOs/DocumentRequests/Generate*.cs`

### Frontend:
- Components: `client/src/features/document/components/DocumentGenerationModal.tsx`
- Hooks: `client/src/features/document/hooks/useGenerate*.ts`
- Services: `client/src/features/document/services/documentGenerationService.ts`
- Schemas: `client/src/features/auth/schemas/registerSchema.ts`

---

**Implementation Date**: January 2025
**Status**: ✅ Core Implementation Complete - Integration Pending
