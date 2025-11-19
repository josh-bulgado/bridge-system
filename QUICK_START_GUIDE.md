# Quick Start Guide - Document Request System

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd server
dotnet run
```
The API will be available at `http://localhost:5000`

### 2. Initialize Document Types (First Time Only)
Send a POST request to seed the default document types:
```bash
curl -X POST http://localhost:5000/api/Seed/document-types
```

Or use your API client (Postman, Insomnia, etc.):
- Method: POST
- URL: `http://localhost:5000/api/Seed/document-types`

### 3. Start the Frontend
```bash
cd client
npm run dev
```
The app will be available at `http://localhost:5173`

## 📋 Using the System as a Resident

### Creating a New Request
1. Login as a resident
2. Navigate to the resident dashboard (`/resident`)
3. Click **"New Request"** button
4. Select a document type from the dropdown
5. Enter the purpose (minimum 10 characters)
6. Set quantity (1-10)
7. Review the price and required documents
8. Click **"Submit Request"**

### Viewing Your Requests
1. From the dashboard, click **"View All Requests"**
2. Or navigate to `/resident/requests`
3. Use the search bar to find specific requests
4. Filter by status using the dropdown
5. Click on any request to view details

### Request Details
1. Click on a request card to see full details
2. View:
   - Request status and timeline
   - Document information
   - Payment details
   - Required documents
   - Status history

## 🎯 Features

### Dashboard Statistics (Real-time)
- **Total Requests**: All your submitted requests
- **Action Required**: Requests needing your input
- **Ready for Pickup**: Documents ready to collect
- **Completed**: Successfully processed requests

### Recent Requests
- Shows your 5 most recent requests
- Click to view full details
- Color-coded status badges

### Quick Actions
- Create new request
- View all requests
- Check pickup schedule

## 📄 Available Document Types

| Document | Code | Price | Processing Time |
|----------|------|-------|-----------------|
| Barangay Clearance | BC | ₱50.00 | 3 days |
| Certificate of Residency | CR | ₱30.00 | 2 days |
| Certificate of Indigency | CI | FREE | 3 days |
| Business Permit | BP | ₱500.00 | 7 days |
| Barangay ID | BID | ₱100.00 | 5 days |
| Certificate of Good Moral | CGM | ₱30.00 | 3 days |

## 🔄 Request Status Lifecycle

```
Pending → Processing → Ready for Pickup → Completed
           ↓
    Action Required
           ↓
        Rejected
```

### Status Descriptions
- **Pending**: Request submitted, awaiting staff review
- **Processing**: Staff is working on your request
- **Action Required**: You need to provide additional information or documents
- **Ready for Pickup**: Your document is ready at the barangay office
- **Completed**: Request fulfilled and document picked up
- **Rejected**: Request denied (reason provided)

## 🔧 API Endpoints Quick Reference

### For Residents
```
GET  /api/DocumentRequest/my-requests       - Get my requests
GET  /api/DocumentRequest/my-statistics     - Get my statistics
GET  /api/DocumentRequest/{id}              - Get request details
POST /api/DocumentRequest                   - Create new request
GET  /api/DocumentType/active               - Get available document types
```

### Request Body Example (Create Request)
```json
{
  "documentType": "Barangay Clearance",
  "purpose": "For employment requirements at ABC Company",
  "quantity": 1
}
```

## 🔐 Authentication

All request endpoints require JWT authentication:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are automatically handled by the frontend after login.

## ⚠️ Important Notes

1. **Resident Verification**: Some document types require your residency to be verified before you can request them.

2. **Payment**: If a document requires payment, you'll need to pay the specified amount. The payment status will be tracked with your request.

3. **Required Documents**: Check the required documents list when creating a request. You may need to bring these documents for processing.

4. **Request Number**: Each request gets a unique number in format `REQ-YYYY-###` for easy tracking.

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change the port in `launchSettings.json`
- **MongoDB connection**: Check your MongoDB connection string in `.env`
- **JWT errors**: Ensure `JWT_KEY` is set in `.env`

### Frontend Issues
- **API connection**: Verify `VITE_API_URL` in your environment variables
- **Authentication errors**: Try logging out and logging in again
- **Empty statistics**: Create at least one request to see statistics

### Common Errors
- **"Resident verification required"**: Your residency needs to be verified by staff
- **"User must have a resident profile"**: Complete your resident profile first
- **"Invalid document type"**: The document type may have been deactivated

## 📞 Support

For issues or questions:
1. Check the main documentation: `DOCUMENT_REQUEST_SYSTEM.md`
2. Review API responses for error messages
3. Check browser console for frontend errors
4. Review server logs for backend issues

## ✅ Testing Checklist

- [ ] Backend server is running
- [ ] Frontend development server is running
- [ ] Document types are initialized
- [ ] User is registered and logged in
- [ ] Can view dashboard with statistics
- [ ] Can create a new request
- [ ] Can view all requests
- [ ] Can view request details
- [ ] Can filter and search requests

---

**Happy requesting! 🎉**
