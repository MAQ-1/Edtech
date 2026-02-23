# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Current Setup
- **Frontend**: https://studynotion-five-beta.vercel.app
- **Backend**: https://edtech-ojdt.onrender.com

---

## 🔴 CRITICAL ISSUE: Frontend-Backend Not Connected

Your site can't access anything because environment variables are missing in production.

---

## ✅ STEP 1: Configure Vercel (Frontend)

### Add Environment Variable:

1. Go to: https://vercel.com/dashboard
2. Select project: **studynotion-five-beta**
3. Click **Settings** → **Environment Variables**
4. Add this variable:

```
Name: REACT_APP_BASE_URL
Value: https://edtech-ojdt.onrender.com/api/v1
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **⋯** on latest deployment → **Redeploy**

---

## ✅ STEP 2: Configure Render (Backend)

### Add Environment Variable:

1. Go to: https://dashboard.render.com
2. Select service: **edtech-ojdt**
3. Click **Environment** tab
4. Add this variable:

```
Key: FRONTEND_URL
Value: https://studynotion-five-beta.vercel.app
```

5. Click **Save Changes** (auto-redeploys)

---

## ✅ STEP 3: Verify Connection

### Test Backend (5 min after Render redeploy):
```bash
curl https://edtech-ojdt.onrender.com/health
# Expected: {"status":"OK"}
```

### Test Frontend (5 min after Vercel redeploy):
1. Open: https://studynotion-five-beta.vercel.app
2. Open Browser Console (F12)
3. Go to **Network** tab
4. Try to login/signup
5. Check API calls go to: `https://edtech-ojdt.onrender.com/api/v1/...`

---

## 🐛 If Still Not Working

### Check CORS in Browser Console:
If you see: `Access-Control-Allow-Origin` error

**Fix**: Verify `FRONTEND_URL` in Render matches exactly:
```
https://studynotion-five-beta.vercel.app
```
(No trailing slash!)

### Check Backend Logs in Render:
1. Go to Render dashboard
2. Click **Logs** tab
3. Look for CORS errors or connection issues

---

## 📊 Expected Behavior After Fix

✅ Frontend loads without errors
✅ API calls reach backend
✅ Login/Signup works
✅ No CORS errors in console
✅ Data loads from database

---

## ⏱️ Timeline

- Vercel redeploy: ~2-3 minutes
- Render redeploy: ~5-7 minutes
- Total: ~10 minutes

---

## 🆘 Emergency Fallback

If Render is slow/sleeping, add this to Render env:
```
NODE_ENV=production
```

This ensures production optimizations are enabled.
