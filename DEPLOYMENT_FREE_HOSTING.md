# 🆓 Free Deployment Strategy for Bridge System

## 🎯 Recommended Free Tier Stack

### **Best Overall Option: Railway + Vercel**

| Component | Platform | Free Tier | Why It's Best |
|-----------|----------|-----------|---------------|
| **Frontend** | Vercel | 100GB bandwidth/month | ✅ Best performance, auto-deploy, CDN |
| **Backend API** | Railway | $5 credit/month (~500 hours) | ✅ Easy .NET deployment, built-in domains |
| **Database** | MongoDB Atlas | 512MB storage | ✅ Already configured |
| **File Storage** | Cloudinary | 25GB storage, 25k transformations | ✅ Already configured |
| **Email** | Resend | 100 emails/day | ✅ Already configured |

---

## 🏆 Top 3 Deployment Options Compared

### **Option 1: Railway (Backend) + Vercel (Frontend)** ⭐ RECOMMENDED

#### ✅ Pros:
- Railway has **excellent .NET 9 support** (one-click deploy)
- Vercel is **industry-leading** for React/Vite apps
- **Automatic HTTPS** on both platforms
- **Git-based auto-deploy** (push to deploy)
- Railway provides **persistent storage** for logs
- **Built-in environment variables** management
- Railway gives **$5/month credit** (enough for small apps)

#### ❌ Cons:
- Railway credit runs out after ~500 server hours/month
- Need to monitor usage carefully

#### 💰 Cost After Free Tier:
- Railway: ~$5-10/month for hobby projects
- Vercel: Free forever for personal projects

---

### **Option 2: Render (Backend) + Vercel (Frontend)**

#### ✅ Pros:
- Render has **true unlimited free tier** for web services
- Supports .NET natively
- Automatic HTTPS and CDN
- Good for learning/demos

#### ❌ Cons:
- **Free tier spins down after 15 mins of inactivity** (cold starts = 30-60s delay)
- Limited to 750 hours/month per service
- Performance issues with free tier

#### 💰 Cost:
- Render: Upgrade to $7/month for always-on
- Vercel: Free

---

### **Option 3: Azure App Service (Backend) + Static Web Apps (Frontend)**

#### ✅ Pros:
- **Free tier doesn't sleep** (always on)
- Microsoft platform = best .NET support
- Integrated with GitHub Actions
- Professional-grade infrastructure

#### ❌ Cons:
- More complex setup than Railway/Render
- Free tier has **60 CPU minutes/day limit** (may hit limit with moderate traffic)
- Requires Azure account

#### 💰 Cost:
- Free tier available, upgrade to ~$13/month for F1 tier

---

## 🚀 RECOMMENDED: Railway + Vercel Setup Guide

### **Part 1: Deploy Backend to Railway**

#### Step 1: Prepare Your Repository

**Create `railway.json` in project root:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && dotnet publish -c Release -o out"
  },
  "deploy": {
    "startCommand": "cd server/out && dotnet server.dll",
    "healthcheckPath": "/swagger",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### Step 2: Deploy to Railway

1. **Sign up:** https://railway.app (use GitHub login)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `bridge-system` repository
   - Railway auto-detects .NET

3. **Configure Environment Variables:**
   Go to Variables tab and add:
   ```
   JWT_KEY=<generate_new_key>
   MONGODB_URI=<your_mongodb_atlas_connection>
   RESEND_API_KEY=<your_resend_key>
   RESEND_FROM_EMAIL=noreply@bridgesystem.abrdns.com
   RESEND_FROM_NAME=Bridge System
   GOOGLE_CLIENT_ID=<your_google_client_id>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

4. **Get Your API URL:**
   - Railway generates: `https://bridge-system-production.up.railway.app`
   - Or add custom domain in Settings

---

### **Part 2: Deploy Frontend to Vercel**

#### Step 1: Update Frontend Configuration

**Create `client/.env.production`:**
```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>
VITE_CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
VITE_CLOUDINARY_API_KEY=<your_cloudinary_key>
VITE_CLOUDINARY_API_SECRET=<your_cloudinary_secret>
```

#### Step 2: Create `vercel.json` in `client/` folder:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
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
    }
  ]
}
```

#### Step 3: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login & Deploy:**
   ```bash
   cd client
   vercel login
   vercel --prod
   ```

3. **Or use Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import from GitHub
   - Select repository
   - Set Root Directory: `client`
   - Add environment variables
   - Deploy!

4. **Your Frontend URL:**
   - Vercel provides: `https://bridge-system.vercel.app`
   - Or add custom domain for free

---

### **Part 3: Update CORS Configuration**

**Edit `server/Program.cs`** (around line 86):

```csharp
// Get allowed origins from environment variable
var allowedOriginsString = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") 
    ?? "http://localhost:5173";
var allowedOrigins = allowedOriginsString.Split(',');

builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("X-Rate-Limit-Remaining", "X-Rate-Limit-Reset");
    });
});
```

**Add to Railway environment variables:**
```
ALLOWED_ORIGINS=https://bridge-system.vercel.app,http://localhost:5173
```

---

### **Part 4: Update CSP Headers**

**Edit `server/Program.cs`** (around line 182):

```csharp
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
var apiUrl = Environment.GetEnvironmentVariable("RAILWAY_PUBLIC_DOMAIN") 
    ?? Environment.GetEnvironmentVariable("RAILWAY_STATIC_URL")
    ?? "localhost:5239";

context.Response.Headers["Content-Security-Policy"] =
    "default-src 'self'; " +
    $"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    $"connect-src 'self' {apiUrl} wss://{apiUrl} https://{frontendUrl} https://accounts.google.com https://www.googleapis.com https://res.cloudinary.com; " +
    "frame-src https://accounts.google.com;";
```

**Add to Railway:**
```
FRONTEND_URL=https://bridge-system.vercel.app
```

---

## 📊 Cost Breakdown & Limits

### **Free Tier Limits:**

| Service | Free Limit | What Happens After |
|---------|------------|-------------------|
| Railway | $5 credit (~500 hrs) | Need to add credit card ($5/month min) |
| Vercel | 100GB bandwidth | Upgrade to Pro ($20/month) |
| MongoDB Atlas | 512MB, 500 connections | Upgrade to M10 ($0.08/hour) |
| Cloudinary | 25GB storage, 25k transforms | Upgrade to Plus ($89/month) |
| Resend | 100 emails/day, 3k/month | Upgrade to Pro ($20/month) |

### **Expected Usage for Small Barangay:**
- **Users:** ~100-500 residents
- **Traffic:** ~1000-5000 requests/day
- **Storage:** ~5-10GB documents/year
- **Emails:** ~50-100/day

**Verdict:** Free tier should work for 3-6 months, then ~$5-15/month costs

---

## ⚡ Alternative Free Options

### **If Railway Credit Runs Out:**

#### **Option A: Fly.io**
- 3 shared-cpu VMs free
- Better than Render (doesn't sleep as aggressively)
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch --dockerfile server/Dockerfile
```

#### **Option B: Koyeb**
- 1 free web service (doesn't sleep)
- Good .NET support
- Similar to Railway

#### **Option C: Heroku (with Student Pack)**
- If you have GitHub Student Developer Pack
- Heroku credits included
- Eco dyno = $5/month (or free with pack)

---

## 🔧 Quick Deploy Commands

### **Full Deployment Script:**

```bash
#!/bin/bash

echo "🚀 Deploying Bridge System..."

# 1. Deploy Backend to Railway
echo "📦 Deploying Backend..."
cd server
railway login
railway link
railway up

# 2. Get Railway URL
RAILWAY_URL=$(railway domain)
echo "✅ Backend deployed to: $RAILWAY_URL"

# 3. Update frontend env
echo "🔧 Configuring Frontend..."
cd ../client
echo "VITE_API_URL=$RAILWAY_URL/api" > .env.production

# 4. Deploy Frontend to Vercel
echo "🌐 Deploying Frontend..."
vercel --prod

echo "✅ Deployment Complete!"
echo "🎉 Your app is live!"
```

---

## 📋 Pre-Deployment Checklist

Before deploying to free tiers:

- [ ] Remove `.env` from git (security!)
- [ ] Generate new JWT_KEY for production
- [ ] Verify MongoDB Atlas network access (allow 0.0.0.0/0 for Railway)
- [ ] Test Google OAuth with production URLs
- [ ] Configure Resend domain verification
- [ ] Update Cloudinary upload presets
- [ ] Test locally with production build
- [ ] Prepare rollback plan

---

## 🎯 Deployment Timeline

- **Railway Setup:** 15 minutes
- **Vercel Setup:** 10 minutes
- **Configuration:** 20 minutes
- **Testing:** 15 minutes
- **Total:** ~1 hour

---

## 📞 Support Links

- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **Railway Discord:** https://discord.gg/railway (very helpful community!)
- **Vercel Support:** https://vercel.com/support

---

## 🚨 Important Notes

1. **Railway Credit:** Monitor usage at https://railway.app/account/usage
2. **Cold Starts:** Railway free tier may have slight delays after inactivity
3. **Logs:** Check Railway logs regularly for errors
4. **Backups:** MongoDB Atlas auto-backup available in M10+ tier
5. **Custom Domain:** Both Railway and Vercel support free custom domains

---

## 🎉 What You Get

- ✅ Professional HTTPS URLs
- ✅ Automatic deployments on git push
- ✅ Built-in CI/CD
- ✅ Environment variable management
- ✅ Logging and monitoring
- ✅ 99.9% uptime (on paid tiers)
- ✅ CDN for frontend assets
- ✅ Auto-scaling (within limits)

**Total Cost: $0 for first 3-6 months, then ~$5-10/month**

---

**Ready to deploy? Let's start with Railway! 🚂**
