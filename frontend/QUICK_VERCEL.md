# ⚡ Vercel Quick Deploy

## 🎯 Essential Info for Vercel

### Project Type
- **Framework**: Create React App (React 19)
- **Build Tool**: react-scripts
- **Package Manager**: npm

### Vercel Settings
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
Node Version: 18.x
```

### Environment Variables (Required)
```
REACT_APP_BASE_URL = https://your-backend.onrender.com/api/v1
```

---

## 🚀 3-Step Deploy

### Step 1: Push Code (Already Done ✅)
```bash
# Code is ready in GitHub
# api.js updated with env variable support
# vercel.json created for routing
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import: `MAQ-1/Edtech`
3. Root Directory: `frontend`
4. Add env var: `REACT_APP_BASE_URL`
5. Click Deploy

### Step 3: Update Backend
```
Render → Environment Variables
Add: FRONTEND_URL = https://your-app.vercel.app
Redeploy backend
```

---

## 📋 Vercel Dashboard Checklist

When creating project:
- [x] Select "Create React App" preset
- [x] Set root directory to `frontend`
- [x] Keep default build command
- [x] Keep default output directory
- [x] Add `REACT_APP_BASE_URL` env var
- [x] Deploy

---

## 🔗 URLs You'll Need

**Your Backend (Render):**
```
https://your-backend.onrender.com
```

**Your Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Environment Variable Value:**
```
REACT_APP_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## ✅ After Deployment

Test these:
1. Visit Vercel URL
2. Try signup/login
3. Browse courses
4. Check browser console (no errors)
5. Verify API calls work

---

## 🐛 If Something Breaks

**CORS Error?**
→ Add Vercel URL to Render's `FRONTEND_URL`

**Build Failed?**
→ Check Vercel build logs

**API Not Working?**
→ Verify `REACT_APP_BASE_URL` is set

**404 on Routes?**
→ `vercel.json` already created ✅

---

**Time to Deploy**: 5 minutes  
**Difficulty**: Easy  
**Auto-Deploy**: Yes (on git push)

Good luck! 🎉
