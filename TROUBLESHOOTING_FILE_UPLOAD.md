# Troubleshooting File Upload Issues

## Quick Checklist

### 1. ✅ Backend Running?
```bash
cd server
dotnet run
```
**Expected**: Server should start on `http://localhost:5000`

### 2. ✅ Frontend Running?
```bash
cd client
pnpm dev
```
**Expected**: Client should start on `http://localhost:5173`

### 3. ✅ Logged In?
- File upload requires JWT authentication
- Make sure you're logged in as a resident
- Check browser DevTools → Application → Local Storage → Look for auth token

### 4. ✅ Service Registered?
Check `server/Program.cs` contains:
```csharp
builder.Services.AddSingleton<FileStorageService>();
```

---

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" Error

**Symptom**: Upload fails with 401 error in browser console

**Cause**: Not logged in or token expired

**Solution**:
1. Log out and log back in
2. Check if token exists in localStorage
3. Verify token is being sent in request headers

---

### Issue 2: "No file uploaded" Error

**Symptom**: Backend returns "No file uploaded"

**Cause**: File not being sent correctly in FormData

**Solution**:
Check browser Network tab:
- Request should be `multipart/form-data`
- Should see file in Form Data section
- File field should be named "file" (lowercase)

---

### Issue 3: "Invalid file type" Error

**Symptom**: Upload rejected with file type error

**Cause**: File extension not allowed

**Solution**:
- Only JPG, JPEG, PNG, PDF files allowed
- Check file extension is correct
- Try a different file

---

### Issue 4: "File size exceeds 5MB limit"

**Symptom**: Upload rejected due to size

**Cause**: File too large

**Solution**:
- Reduce image quality/size
- Max size is 5MB
- Try a smaller file

---

### Issue 5: CORS Error

**Symptom**: CORS policy error in console

**Cause**: Backend CORS not configured for frontend URL

**Solution**:
Check `server/Program.cs` has CORS configured:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// After var app = builder.Build();
app.UseCors("AllowFrontend");
```

---

### Issue 6: Connection Refused

**Symptom**: `ERR_CONNECTION_REFUSED` or network error

**Cause**: Backend not running or wrong URL

**Solution**:
1. Verify backend is running: `dotnet run` in server directory
2. Check API URL in `client/.env` or vite config
3. Default should be `http://localhost:5000`

---

## Debugging Steps

### Step 1: Open Browser DevTools
1. Press F12 or right-click → Inspect
2. Go to **Console** tab
3. Go to **Network** tab
4. Try uploading a file

### Step 2: Check Console Tab
Look for errors like:
- `401 Unauthorized` → Not logged in
- `404 Not Found` → Backend not running or wrong URL
- `CORS error` → CORS not configured
- Any other error messages

### Step 3: Check Network Tab
1. Filter by "FileUpload"
2. Click on the request
3. Check:
   - **Status Code**: Should be 200
   - **Request Headers**: Should have `Authorization: Bearer ...`
   - **Form Data**: Should see your file
   - **Response**: Should see file URL

### Step 4: Check Backend Logs
Look in your terminal where `dotnet run` is running:
- Should see the request coming in
- Check for any error messages
- MongoDB connection errors?

---

## Test the Backend Directly

### Using curl:
```bash
# First, get your JWT token from browser localStorage
# Then test upload:

curl -X POST http://localhost:5000/api/FileUpload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/test-image.jpg"
```

**Expected Response:**
```json
{
  "fileId": "507f1f77bcf86cd799439011",
  "fileName": "test-image.jpg",
  "fileSize": 245760,
  "contentType": "image/jpeg",
  "url": "/api/FileUpload/507f1f77bcf86cd799439011"
}
```

### Using Postman:
1. Create new POST request
2. URL: `http://localhost:5000/api/FileUpload`
3. Headers: Add `Authorization: Bearer YOUR_TOKEN`
4. Body: Select "form-data"
5. Add key "file" (type: File)
6. Select a file
7. Send

---

## Check MongoDB Connection

### Verify MongoDB is Running
```bash
# Check MongoDB status (if local)
mongosh
# Should connect successfully

# Check if GridFS collections exist after upload
use your_database_name
show collections
# Should see: uploads.files and uploads.chunks
```

---

## Enable Detailed Logging

### Backend - Add to Program.cs:
```csharp
// Before app.Run();
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});
```

### Frontend - Add to handleFileUpload:
```typescript
const handleFileUpload = async (...) => {
  console.log("Starting upload for file:", file.name, file.size, file.type);
  
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    console.log("FormData created, sending request...");
    
    const response = await api.post("/api/FileUpload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    console.log("Upload response:", response.data);
    // ...rest of code
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error response:", error.response);
    // ...rest of code
  }
};
```

---

## Still Not Working?

### Provide These Details:
1. **Error message** from browser console
2. **Network tab** screenshot showing the failed request
3. **Backend logs** from terminal
4. **Auth status** - Are you logged in?
5. **File details** - What file are you trying to upload?
6. **Environment** - MongoDB running? Backend running?

### Quick Reset:
```bash
# Stop everything
# Clear browser cache and localStorage
# Restart backend
cd server && dotnet clean && dotnet run

# Restart frontend in new terminal
cd client && pnpm dev

# Log in again
# Try uploading
```

---

## Verify Files Exist

Check these files exist:
- [ ] `server/src/Services/FileStorageService.cs`
- [ ] `server/src/Controllers/FileUploadController.cs`
- [ ] `server/Program.cs` (with FileStorageService registered)
- [ ] `client/src/features/resident/pages/VerificationPage.tsx`

---

## Contact Info

If still having issues, provide:
1. Exact error message
2. Browser console screenshot
3. Network tab details
4. Backend error logs
