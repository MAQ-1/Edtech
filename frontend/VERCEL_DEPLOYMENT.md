# 🚀 Vercel Frontend Deployment Guide

## 📋 Project Information

**Framework:** React (Create React App)  
**Build Tool:** react-scripts  
**Styling:** Tailwind CSS  
**State Management:** Redux Toolkit  
**Backend:** Node.js + Express (deployed on Render)

---

## ⚙️ Vercel Configuration

### 1. Project Settings

When deploying on Vercel, use these settings:

```
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
Install Command: npm install
Root Directory: frontend
Node Version: 18.x
```

---

## 🔐 Environment Variables (CRITICAL)

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Backend API URL (Your Render deployment)
REACT_APP_BASE_URL=https://your-backend.onrender.com/api/v1

# Optional: Environment identifier
REACT_APP_ENV=production
```

**⚠️ IMPORTANT:**
- Replace `your-backend.onrender.com` with your actual Render URL
- All React env vars MUST start with `REACT_APP_`
- Add to all environments (Production, Preview, Development)

---

## 📝 Required Code Changes

### Step 1: Update API Base URL

**File:** `frontend/src/services/api.js`

Change line 1 from:
```javascript
const BASE_URL = "http://localhost:4000/api/v1"
```

To:
```javascript
// ✅ Vercel deployment fix: Use environment variable
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
```

This allows:
- Production: Uses Render backend URL
- Development: Falls back to localhost

---

### Step 2: Create .env.example (Optional but Recommended)

**File:** `frontend/.env.example`

```env
# Backend API URL
REACT_APP_BASE_URL=http://localhost:4000/api/v1

# Environment
REACT_APP_ENV=development
```

---

### Step 3: Verify .gitignore

**File:** `frontend/.gitignore`

Ensure these are included:
```
# dependencies
/node_modules

# production
/build

# environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# misc
.DS_Store
npm-debug.log*
```

---

## 🚀 Deployment Steps

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import your repository**: `MAQ-1/Edtech`
5. **Configure Project**:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

6. **Add Environment Variables**:
   ```
   REACT_APP_BASE_URL = https://your-backend.onrender.com/api/v1
   ```

7. **Click "Deploy"**

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? edtech-frontend
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: build
#   - Development Command: npm start

# Add environment variables
vercel env add REACT_APP_BASE_URL production
# Enter: https://your-backend.onrender.com/api/v1

# Deploy to production
vercel --prod
```

---

## 🔧 Backend CORS Configuration

Your backend needs to allow your Vercel domain. Update Render environment variables:

```env
FRONTEND_URL=https://your-app.vercel.app
```

**Note:** Your backend already has dynamic CORS configured in `index.js`

---

## ✅ Post-Deployment Checklist

### 1. Test Deployment
- [ ] Visit your Vercel URL
- [ ] Check browser console for errors
- [ ] Verify no CORS errors

### 2. Test API Connection
- [ ] Open browser DevTools → Network tab
- [ ] Try signup/login
- [ ] Verify API calls go to Render backend
- [ ] Check response status codes

### 3. Test Features
- [ ] User registration (OTP email)
- [ ] User login
- [ ] Course browsing
- [ ] Course enrollment
- [ ] Profile updates
- [ ] File uploads (images)

### 4. Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify images load correctly
- [ ] Test on mobile devices

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot connect to backend"
**Solution:**
- Verify `REACT_APP_BASE_URL` is set in Vercel
- Check Render backend is running
- Verify CORS allows Vercel domain

### Issue 2: "CORS policy error"
**Solution:**
- Add Vercel URL to Render env var `FRONTEND_URL`
- Redeploy backend on Render
- Clear browser cache

### Issue 3: "Environment variable not found"
**Solution:**
- Ensure env var starts with `REACT_APP_`
- Redeploy on Vercel after adding env vars
- Check env var is added to all environments

### Issue 4: "Build failed"
**Solution:**
- Check build logs in Vercel dashboard
- Verify `package.json` has all dependencies
- Try building locally: `npm run build`
- Check Node version compatibility

### Issue 5: "Page not found (404)"
**Solution:**
- Verify Output Directory is set to `build`
- Check React Router configuration
- Add `vercel.json` for SPA routing (see below)

---

## 📄 vercel.json Configuration (For React Router)

**File:** `frontend/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes work with React Router.

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

---

## 📊 Deployment URLs

After deployment, you'll get:

1. **Production URL**: `https://your-app.vercel.app`
2. **Custom Domain** (optional): `https://yourdomain.com`
3. **Preview URLs**: `https://your-app-git-branch.vercel.app`

---

## 🎯 Complete Deployment Flow

```
1. Update api.js with environment variable ✅
2. Push changes to GitHub ✅
3. Create Vercel project ✅
4. Add REACT_APP_BASE_URL env var ✅
5. Deploy on Vercel ✅
6. Update FRONTEND_URL on Render ✅
7. Test all features ✅
8. Monitor for errors ✅
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use environment variables** for all API URLs
3. **Enable HTTPS** (automatic on Vercel)
4. **Set secure headers** (automatic on Vercel)
5. **Monitor deployment logs** for errors
6. **Use preview deployments** for testing

---

## 📈 Performance Optimization

### Already Configured:
- ✅ Tailwind CSS (optimized builds)
- ✅ React production build
- ✅ Code splitting (React.lazy if used)

### Recommended:
- [ ] Add image optimization
- [ ] Implement lazy loading for routes
- [ ] Add service worker for PWA
- [ ] Enable Vercel Analytics

---

## 🔗 Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Your Backend (Render)**: https://your-backend.onrender.com
- **GitHub Repo**: https://github.com/MAQ-1/Edtech

---

## 📞 Support

If deployment fails:

1. Check Vercel build logs
2. Verify all environment variables
3. Test build locally: `npm run build`
4. Check backend is accessible
5. Review CORS configuration
6. Contact Vercel support if needed

---

## ✨ Quick Deploy Checklist

```bash
# 1. Update api.js
# Change BASE_URL to use process.env.REACT_APP_BASE_URL

# 2. Commit and push
git add .
git commit -m "feat: Add environment variable support for production"
git push origin main

# 3. Deploy on Vercel
# - Import GitHub repo
# - Set root directory: frontend
# - Add env var: REACT_APP_BASE_URL
# - Deploy

# 4. Update backend
# - Add FRONTEND_URL in Render
# - Redeploy backend

# 5. Test
# - Visit Vercel URL
# - Test all features
# - Check for errors
```

---

**Status**: Ready to deploy  
**Estimated Time**: 10-15 minutes  
**Difficulty**: Easy

Your frontend will be live on Vercel! 🎉
