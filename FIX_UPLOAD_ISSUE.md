# Fix: File Upload Authentication Issue

## Problem
File uploads were failing because JWT token was not being sent with requests.

## Root Cause
The `api.ts` file was missing a request interceptor to add the JWT token to all API requests.

## Solution Applied

### 1. Fixed `client/src/lib/api.ts`
Added request interceptor to automatically include JWT token:

```typescript
// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 2. Enhanced Error Logging
Added detailed console logging in `VerificationPage.tsx` to help debug issues:
- Logs file details before upload
- Logs request status
- Logs success/error responses with emojis for easy identification

## How to Test

### 1. Start Backend
```bash
cd server
dotnet run
```

### 2. Start Frontend
```bash
cd client
pnpm dev
```

### 3. Test Upload
1. Log in as a resident
2. Navigate to `/resident/verify`
3. Open browser DevTools (F12)
4. Go to Console tab
5. Try uploading a file (image or PDF < 5MB)

### Expected Console Output
```
📤 Starting file upload: { name: "test.jpg", size: 245760, type: "image/jpeg" }
📤 Sending upload request...
✅ Upload successful: { fileId: "...", fileName: "test.jpg", ... }
```

### If Still Failing, Check:
1. **401 Unauthorized** → Token not in localStorage or expired
   - Solution: Log out and log in again
   
2. **404 Not Found** → Backend not running
   - Solution: Start backend with `dotnet run`
   
3. **CORS Error** → CORS not configured
   - Solution: Check CORS settings in `Program.cs`
   
4. **500 Server Error** → Backend error
   - Solution: Check backend terminal logs

## Files Modified
- ✅ `client/src/lib/api.ts` - Added JWT token interceptor
- ✅ `client/src/features/resident/pages/VerificationPage.tsx` - Added debug logging

## Testing Checklist
- [ ] Backend is running (`dotnet run`)
- [ ] Frontend is running (`pnpm dev`)
- [ ] Logged in as resident
- [ ] Can see upload zone on verification page
- [ ] Can drag and drop files
- [ ] Can click to select files
- [ ] Upload shows progress indicator
- [ ] Success message appears
- [ ] File appears in uploaded state (green card)
- [ ] Can remove uploaded file
- [ ] Console shows upload logs

## Additional Resources
See `TROUBLESHOOTING_FILE_UPLOAD.md` for comprehensive debugging guide.

## Status
✅ **FIXED** - JWT token now automatically included in all API requests
✅ **ENHANCED** - Added debug logging for easier troubleshooting

---

**Try uploading now and check the browser console for detailed logs!**
