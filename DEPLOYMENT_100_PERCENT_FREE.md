# 🆓 100% FREE Deployment for Students (No Credit Card Required)

## 🎓 BEST FREE OPTIONS FOR STUDENTS

---

## 🏆 Option 1: Render + Vercel (RECOMMENDED - Truly Free)

### **Why This is Best for Students:**
- ✅ **NO CREDIT CARD** required
- ✅ Render free tier doesn't expire
- ✅ Vercel is 100% free for personal projects
- ✅ Both support student/educational projects
- ❌ Only downside: Backend sleeps after 15 mins (wakes in 30-60s)

### **Perfect for:**
- School projects
- Portfolio demonstrations
- Low-traffic barangay system (demo/testing phase)

---

## 🚀 DEPLOYMENT GUIDE: Render (Backend) + Vercel (Frontend)

### **PART 1: Deploy Backend to Render**

#### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (no credit card needed!)
3. Verify email

#### Step 2: Prepare Backend for Render

**Create `render.yaml` in project root:**

```yaml
services:
  - type: web
    name: bridge-system-api
    runtime: docker
    env: docker
    region: singapore
    plan: free
    healthCheckPath: /swagger
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: ASPNETCORE_URLS
        value: http://0.0.0.0:$PORT
      - key: JWT_KEY
        sync: false
      - key: MONGODB_URI
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: RESEND_FROM_EMAIL
        value: noreply@bridgesystem.abrdns.com
      - key: RESEND_FROM_NAME
        value: Bridge System
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

**Create `Dockerfile` in `server/` folder:**

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy csproj and restore dependencies
COPY server.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o /app

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .

# Install libgdiplus for System.Drawing (needed for document generation)
RUN apt-get update && apt-get install -y libgdiplus && rm -rf /var/lib/apt/lists/*

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "server.dll"]
```

**Create `.dockerignore` in `server/` folder:**

```
bin/
obj/
*.env
*.log
.vs/
.vscode/
```

#### Step 3: Deploy to Render

1. **Go to Render Dashboard:** https://dashboard.render.com

2. **Click "New +" → "Web Service"**

3. **Connect GitHub Repository:**
   - Click "Connect account"
   - Select your `bridge-system` repository

4. **Configure Service:**
   - **Name:** `bridge-system-api`
   - **Region:** Singapore (closest to Philippines)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Docker
   - **Docker Command:** (leave blank, uses ENTRYPOINT)
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   ASPNETCORE_ENVIRONMENT=Production
   JWT_KEY=<generate_new_key>
   MONGODB_URI=<your_mongodb_atlas_uri>
   RESEND_API_KEY=<your_resend_key>
   RESEND_FROM_EMAIL=noreply@bridgesystem.abrdns.com
   RESEND_FROM_NAME=Bridge System
   GOOGLE_CLIENT_ID=<your_google_client_id>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   ```

6. **Click "Create Web Service"**
   - Render will build and deploy (takes 5-10 minutes)
   - You'll get URL like: `https://bridge-system-api.onrender.com`

#### Step 4: Keep Backend Awake (Optional)

**Problem:** Free tier sleeps after 15 mins of inactivity

**Solution A: Cron Job (Free)**
Use cron-job.org to ping your API every 14 minutes:
1. Go to https://cron-job.org (free, no signup)
2. Create job: `https://bridge-system-api.onrender.com/swagger`
3. Schedule: Every 14 minutes
4. This keeps it awake during business hours

**Solution B: UptimeRobot (Free)**
1. Go to https://uptimerobot.com
2. Add monitor: `https://bridge-system-api.onrender.com/swagger`
3. Check interval: 5 minutes (max for free tier)

**Solution C: Accept the Sleep (Best for Students)**
- First request takes 30-60s (cold start)
- Subsequent requests are instant
- Perfect for demos/testing

---

### **PART 2: Deploy Frontend to Vercel**

#### Step 1: Prepare Frontend

**Create `vercel.json` in `client/` folder:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Create `client/.env.production`:**

```env
VITE_API_URL=https://bridge-system-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### Step 2: Deploy to Vercel

**Method A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login (uses GitHub, no credit card)
vercel login

# Deploy
cd client
vercel --prod
```

**Method B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Sign up with GitHub (free!)
3. Click "Add New Project"
4. Import `bridge-system` repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables (same as .env.production)
7. Click "Deploy"

**Your URL:** `https://bridge-system.vercel.app`

---

### **PART 3: Update Code for Production**

#### Update 1: CORS Configuration

**Edit `server/Program.cs` (line ~86):**

```csharp
// Get allowed origins from environment variable
var allowedOriginsString = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") 
    ?? "http://localhost:5173,https://bridge-system.vercel.app";
var allowedOrigins = allowedOriginsString.Split(',');

builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .WithExposedHeaders("X-Rate-Limit-Remaining", "X-Rate-Limit-Reset");
    });
});
```

**Add to Render environment variables:**
```
ALLOWED_ORIGINS=https://bridge-system.vercel.app,http://localhost:5173
```

#### Update 2: Port Configuration

**Edit `server/Program.cs` (add after line 155, before `var app = builder.Build();`):**

```csharp
// Configure port for Render (uses PORT env variable)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});
```

#### Update 3: Health Check for Keep-Awake

**Add to `server/Program.cs` (before `app.Run();`):**

```csharp
// Simple health check endpoint
app.MapGet("/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow 
}));
```

---

## 💡 Option 2: Koyeb (Alternative - Also 100% Free)

### **Why Koyeb:**
- ✅ NO CREDIT CARD required
- ✅ Doesn't sleep as aggressively as Render
- ✅ Better performance than Render free tier
- ✅ $5.50/month free credit (never expires for students)
- ✅ Good .NET support

### **Koyeb Free Tier:**
- 1 web service
- Shared CPU
- 512MB RAM
- Better uptime than Render

### **Deploy to Koyeb:**

1. **Sign up:** https://www.koyeb.com
2. **Create App:**
   - Select "Docker" deployment
   - Connect GitHub
   - Use same Dockerfile as Render
3. **Configure:**
   - Name: bridge-system-api
   - Region: Singapore
   - Instance type: Nano (free)
4. **Add environment variables** (same as Render)
5. Deploy!

**URL:** `https://bridge-system-api-your-org.koyeb.app`

---

## 🎯 Option 3: Fly.io (Best Performance - Limited Free)

### **Why Fly.io:**
- ✅ 3 shared VMs free
- ✅ Better performance than Render
- ✅ Doesn't sleep
- ⚠️ Requires credit card but won't charge unless you exceed limits

### **Deploy to Fly.io:**

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth signup

# Deploy backend
cd server
fly launch --name bridge-system-api
```

**Configure `fly.toml`:**
```toml
app = "bridge-system-api"
primary_region = "sin"

[build]
  dockerfile = "Dockerfile"

[env]
  ASPNETCORE_ENVIRONMENT = "Production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

---

## 📊 FREE TIER COMPARISON

| Platform | Sleep? | RAM | Setup Difficulty | Best For |
|----------|--------|-----|------------------|----------|
| **Render** | Yes (15min) | 512MB | ⭐ Easy | Students, demos |
| **Koyeb** | Rarely | 512MB | ⭐⭐ Medium | Better performance |
| **Fly.io** | No | 256MB | ⭐⭐⭐ Advanced | Production-like |
| **Vercel** | No | N/A | ⭐ Easy | Frontend (all use this) |

---

## 🎓 GitHub Student Developer Pack Benefits

### **Get FREE Credits:**

If you're a student, apply for GitHub Student Developer Pack:
- **URL:** https://education.github.com/pack

**You get:**
- ✅ **DigitalOcean:** $200 credit (1 year)
- ✅ **Microsoft Azure:** $100 credit
- ✅ **Heroku:** 1 free Eco dyno
- ✅ **MongoDB Atlas:** $50 credit
- ✅ **Name.com:** Free domain for 1 year
- ✅ **50+ other services**

**Requirements:**
- Valid student ID or school email
- GitHub account

**With this pack, you can use:**
- DigitalOcean droplet ($6/month = 33 months free!)
- Azure App Service (much better than free tier)

---

## 🚀 RECOMMENDED PATH FOR STUDENTS

### **Phase 1: Development/Demo (Free)**
```
Frontend: Vercel (free forever)
Backend: Render (free, sleeps)
Database: MongoDB Atlas (512MB free)
```

### **Phase 2: School Presentation (Free)**
- Use Render + cron-job.org to keep awake during presentation
- Perfect for demos and testing

### **Phase 3: Real Deployment (If needed)**
- Apply for GitHub Student Pack
- Use DigitalOcean credit ($200 = 33 months!)
- Deploy on $6/month droplet

---

## 🔧 Quick Deployment Script

**Create `deploy-free.sh`:**

```bash
#!/bin/bash

echo "🎓 Deploying Bridge System (100% FREE)"

# 1. Check if Render config exists
if [ ! -f "server/Dockerfile" ]; then
    echo "❌ Dockerfile not found. Creating..."
    # Create Dockerfile (content from above)
fi

# 2. Deploy Backend to Render
echo "📦 Backend: Deploy to Render manually via dashboard"
echo "   URL: https://dashboard.render.com"
echo "   Instructions in DEPLOYMENT_100_PERCENT_FREE.md"

# 3. Deploy Frontend to Vercel
echo "🌐 Deploying Frontend to Vercel..."
cd client

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy
echo "🚀 Deploying..."
vercel --prod

echo "✅ Frontend deployed!"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update ALLOWED_ORIGINS in Render"
echo "   2. Add your Vercel URL to Google OAuth"
echo "   3. Test the deployment"
echo ""
echo "🎉 Done! Your app is live (for FREE)!"
```

---

## ⚠️ Important Notes for Students

### **1. Cold Start Warning**
Render free tier sleeps after 15 mins:
- First request: 30-60 seconds to wake up
- Solution: Use cron-job.org during presentations
- Tell users: "Please wait, loading..."

### **2. Resource Limits**
Free tier has limited resources:
- Render: 512MB RAM, 0.1 CPU
- Good for 10-50 concurrent users
- Perfect for barangay demo/testing

### **3. Monitoring**
Check these regularly:
- Render logs: https://dashboard.render.com
- Vercel analytics: https://vercel.com/analytics
- MongoDB Atlas: Usage metrics

### **4. Backup Plan**
Always have local development working:
```bash
# Backend
cd server && dotnet run

# Frontend
cd client && npm run dev
```

---

## 📞 Student Resources

- **Render Community:** https://community.render.com
- **Vercel Discord:** https://vercel.com/discord
- **MongoDB University:** https://university.mongodb.com (free courses)
- **GitHub Education:** https://education.github.com

---

## 🎯 Step-by-Step TODO

- [ ] Create Render account (no card needed)
- [ ] Create Vercel account (no card needed)
- [ ] Create Dockerfile in server folder
- [ ] Create vercel.json in client folder
- [ ] Update CORS in Program.cs
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Update Google OAuth URLs
- [ ] Test the deployment
- [ ] Setup cron-job.org for keep-awake
- [ ] (Optional) Apply for GitHub Student Pack

---

## 💰 Total Cost

**Forever:** $0.00

**Perfect for:**
- ✅ School projects
- ✅ Portfolio demonstrations
- ✅ Barangay system testing
- ✅ Learning and development

---

**Let's deploy for FREE! 🎓🚀**
