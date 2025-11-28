# 🚀 Bridge System - Deployment Checklist

## 📋 Pre-Deployment Overview

**Stack:**
- **Frontend:** React 19 + Vite + TypeScript + TailwindCSS
- **Backend:** ASP.NET Core 9.0 + C#
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
- **Email:** Resend
- **Real-time:** SignalR
- **Auth:** JWT + Google OAuth

---

## ⚠️ CRITICAL SECURITY ISSUES TO FIX

### 🔴 **1. SECRETS EXPOSED IN REPOSITORY**
Your `.env` files contain production secrets and are NOT in `.gitignore` properly:

**Files with exposed secrets:**
- `client/.env` - Contains API keys
- `server/.env` - Contains JWT key, MongoDB credentials, API keys

**Immediate Actions Required:**
```bash
# 1. Remove sensitive files from git history
git rm --cached client/.env
git rm --cached server/.env
git commit -m "Remove sensitive environment files"

# 2. Rotate ALL compromised credentials:
#    - JWT_KEY (generate new)
#    - MongoDB password
#    - Cloudinary API keys
#    - Resend API key
#    - Google OAuth credentials (if public repo)
```

**Fix:** While `.gitignore` includes `.env` patterns, the files were already committed.

---

## ✅ DEPLOYMENT CHECKLIST

### 1️⃣ **Environment Configuration**

#### **Backend Environment Variables**
Create production `.env` file (DO NOT COMMIT):

```env
# JWT Configuration
JWT_KEY=<GENERATE_NEW_256BIT_KEY>

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=BRIDGE-Cluster

# Email Service (Resend)
RESEND_API_KEY=<your_production_key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Bridge System

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# ASP.NET Environment
ASPNETCORE_ENVIRONMENT=Production
```

#### **Frontend Environment Variables**
Create production `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>
VITE_CLOUDINARY_CLOUD_NAME=<your_cloud_name>
VITE_CLOUDINARY_API_KEY=<your_api_key>
VITE_CLOUDINARY_API_SECRET=<your_api_secret>
```

---

### 2️⃣ **Code Changes Required**

#### **A. Update CORS Configuration** (`server/Program.cs` lines 86-102)

**Current:** Only allows localhost origins
```csharp
policy.WithOrigins(
    "http://localhost:5173",
    "http://localhost:5174",
    // ...
)
```

**Change to:**
```csharp
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:5173" };

policy.WithOrigins(allowedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithExposedHeaders("X-Rate-Limit-Remaining", "X-Rate-Limit-Reset");
```

Add to `appsettings.json`:
```json
"AllowedOrigins": [
  "https://your-frontend-domain.com"
]
```

#### **B. Update CSP Headers** (`server/Program.cs` lines 176-183)

Update the `connect-src` directive to include your production domains:
```csharp
"connect-src 'self' https://your-api-domain.com wss://your-api-domain.com https://accounts.google.com https://www.googleapis.com; "
```

#### **C. Enable HTTPS Redirect**
Add after line 189 in `server/Program.cs`:
```csharp
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
```

#### **D. Configure MongoDB Connection String**
Ensure `server/src/Services/MongoDBContext.cs` properly reads from environment (appears correct ✅)

---

### 3️⃣ **Build & Test Locally**

#### **Backend Build**
```bash
cd server
dotnet restore
dotnet build --configuration Release
dotnet test  # If you have tests
dotnet publish -c Release -o ./publish
```

#### **Frontend Build**
```bash
cd client
npm install
npm run build
# Test the production build locally
npm run preview
```

**Verify build output:**
- ✅ `client/dist/` contains built files
- ✅ `server/publish/` contains compiled assemblies
- ✅ No build errors or warnings

---

### 4️⃣ **Database Setup**

#### **MongoDB Atlas Configuration**
- [ ] Database created: `bridge-system`
- [ ] Network access configured (Add deployment server IP)
- [ ] Database user created with appropriate permissions
- [ ] Connection string updated with production credentials
- [ ] Indexes created (check collections for performance)

#### **Required Collections** (Auto-created by app):
- users
- residents
- documents
- documentRequests
- documentTemplates
- notifications
- barangayConfigs
- passwordHistory

---

### 5️⃣ **External Services Configuration**

#### **Cloudinary**
- [ ] Production account created
- [ ] Upload presets configured
- [ ] Folder structure created
- [ ] API keys rotated and secured

#### **Resend (Email)**
- [ ] Domain verified in Resend
- [ ] SPF/DKIM records configured
- [ ] API key generated for production
- [ ] From email configured (`noreply@yourdomain.com`)

#### **Google OAuth**
- [ ] OAuth consent screen configured for production
- [ ] Authorized redirect URIs updated:
  - `https://your-frontend-domain.com`
  - Production callback URLs
- [ ] Production credentials generated

---

### 6️⃣ **Deployment Options**

#### **Option A: Cloud Platform (Recommended)**

##### **Frontend: Vercel/Netlify**
```bash
# Vercel
npm i -g vercel
cd client
vercel --prod

# Set environment variables in Vercel dashboard
```

##### **Backend: Azure App Service / AWS / Railway**

**Azure:**
```bash
# Install Azure CLI
az login
az webapp up --name bridge-system-api --runtime "DOTNETCORE:9.0"
```

**Railway:**
- Connect GitHub repo
- Set environment variables
- Auto-deploys on push

#### **Option B: VPS (DigitalOcean/Linode)**

**Backend Setup:**
```bash
# Install .NET 9
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 9.0

# Setup systemd service
sudo nano /etc/systemd/system/bridge-api.service
```

**systemd service file:**
```ini
[Unit]
Description=Bridge System API
After=network.target

[Service]
WorkingDirectory=/var/www/bridge-api
ExecStart=/usr/bin/dotnet /var/www/bridge-api/server.dll
Restart=always
RestartSec=10
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
EnvironmentFile=/var/www/bridge-api/.env

[Install]
WantedBy=multi-user.target
```

**Nginx Reverse Proxy:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5239;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SignalR specific
    location /notificationHub {
        proxy_pass http://localhost:5239;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**Frontend Setup:**
```bash
# Copy dist folder to nginx
sudo cp -r client/dist/* /var/www/html/
```

---

### 7️⃣ **SSL/TLS Certificate**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

### 8️⃣ **Post-Deployment Verification**

#### **Health Checks**
- [ ] API is accessible: `https://api.yourdomain.com/swagger`
- [ ] Frontend loads: `https://yourdomain.com`
- [ ] Database connection successful
- [ ] SignalR WebSocket connection working
- [ ] File uploads work (Cloudinary)
- [ ] Email sending works (Resend)
- [ ] Google OAuth login works
- [ ] JWT authentication works

#### **Test Key Flows**
- [ ] User registration
- [ ] Email verification
- [ ] Login/Logout
- [ ] Document request creation
- [ ] File upload
- [ ] Real-time notifications
- [ ] Admin dashboard
- [ ] PDF generation

#### **Performance**
- [ ] Frontend loads < 3s
- [ ] API response times < 500ms
- [ ] MongoDB queries optimized
- [ ] CDN configured for static assets

---

### 9️⃣ **Monitoring & Logging**

#### **Backend Logging**
Add structured logging in `Program.cs`:
```csharp
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    if (builder.Environment.IsProduction())
    {
        // Add production logging provider (e.g., Serilog, Application Insights)
    }
});
```

#### **Error Tracking**
Consider integrating:
- Sentry
- Application Insights
- LogRocket

#### **Uptime Monitoring**
- UptimeRobot
- Pingdom
- StatusCake

---

### 🔟 **Security Hardening**

#### **Backend Security**
- [ ] HTTPS enforced (no HTTP traffic)
- [ ] Rate limiting configured ✅ (Already in code)
- [ ] SQL injection protection ✅ (Using MongoDB with parameterized queries)
- [ ] XSS protection ✅ (Headers configured)
- [ ] CSRF protection for state-changing operations
- [ ] Input validation ✅ (Using DTOs)
- [ ] Secrets in environment variables ✅
- [ ] Security headers configured ✅

#### **Frontend Security**
- [ ] No secrets in client code ✅
- [ ] Content Security Policy enforced ✅
- [ ] Dependency vulnerabilities scanned
- [ ] XSS protection through React's built-in escaping ✅

#### **Database Security**
- [ ] Network access restricted to deployment servers
- [ ] Strong passwords used
- [ ] Regular backups configured
- [ ] Audit logging enabled

---

## 📝 **Create Environment Template Files**

You should create these template files for documentation:

**`.env.example` for server:**
```env
JWT_KEY=your_jwt_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Bridge System
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`.env.example` for client:**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚨 **IMMEDIATE ACTION ITEMS**

### **Priority 1 (Critical - Do First):**
1. ✅ Review this checklist
2. 🔴 Remove `.env` files from git history
3. 🔴 Rotate ALL API keys and secrets
4. 🔴 Create `.env.example` templates
5. 🔴 Update CORS for production domains

### **Priority 2 (Before Deployment):**
1. Test production build locally
2. Configure external services (Cloudinary, Resend, Google)
3. Setup production MongoDB database
4. Update CSP headers
5. Add HTTPS redirect

### **Priority 3 (Deployment):**
1. Choose hosting platform
2. Deploy backend
3. Deploy frontend
4. Configure SSL/TLS
5. Setup monitoring

### **Priority 4 (Post-Deployment):**
1. Run health checks
2. Test all critical flows
3. Monitor logs for errors
4. Setup automated backups
5. Document the deployment

---

## 📚 **Useful Commands**

```bash
# Generate new JWT key (use in PowerShell)
$bytes = New-Object byte[] 64
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)

# Check backend health
curl https://api.yourdomain.com/swagger

# Check frontend build size
cd client && npm run build
du -sh dist/

# Test MongoDB connection
mongosh "mongodb+srv://cluster.mongodb.net/" --username user

# View backend logs (if using systemd)
sudo journalctl -u bridge-api.service -f
```

---

## 🎯 **Deployment Timeline Estimate**

- **Setup & Configuration:** 2-3 hours
- **Code Changes:** 1-2 hours  
- **Testing:** 2-3 hours
- **Deployment:** 1-2 hours
- **Verification:** 1 hour
- **Total:** ~8-11 hours

---

## 📞 **Support Resources**

- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Cloudinary:** https://cloudinary.com/documentation
- **Resend:** https://resend.com/docs
- **ASP.NET Core Deployment:** https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/
- **Vite Deployment:** https://vite.dev/guide/static-deploy

---

**Good luck with your deployment! 🚀**

*Last updated: [Current Date]*
