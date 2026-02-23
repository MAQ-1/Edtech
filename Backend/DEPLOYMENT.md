# 🚀 Render Deployment Guide

## Pre-Deployment Checklist

### ✅ CRITICAL: Security Actions Required

1. **IMMEDIATELY ROTATE ALL CREDENTIALS** (current ones are exposed):
   - Generate new MongoDB user/password in Atlas
   - Regenerate Cloudinary API keys
   - Create new Gmail App Password
   - Generate strong JWT secret (min 32 chars): `openssl rand -base64 32`

2. **Update .gitignore** - Ensure `.env` is never committed

---

## Render Setup Steps

### 1. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `edtech-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `Backend` (if repo root is different)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for production)

---

### 2. Environment Variables (CRITICAL)

Add these in Render Dashboard → Environment:

```
CLOUDINARY_CLOUD_NAME=<new_value>
CLOUDINARY_API_KEY=<new_value>
CLOUDINARY_API_SECRET=<new_value>

PORT=4000
MONGODB_URL=<new_mongodb_connection_string>
JWT_SECRET=<strong_random_32_char_string>

FOLDER_NAME=CourseHelp

MAIL_USERNAME=<your_email>
MAIL_PASSWORD=<new_app_password>
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
EMAIL=<your_email>

FRONTEND_URL=<your_vercel_frontend_url>
NODE_ENV=production
```

---

### 3. MongoDB Atlas Configuration

1. Go to MongoDB Atlas → Network Access
2. Add Render's IP: **0.0.0.0/0** (or specific Render IPs)
3. Update connection string with new credentials

---

### 4. Gmail App Password Setup

1. Enable 2FA on Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate new app password
4. Use this in `MAIL_PASSWORD` env var

---

### 5. Post-Deployment

After deployment completes:

1. **Test Health Check**: `https://your-app.onrender.com/health`
2. **Test Root Endpoint**: `https://your-app.onrender.com/`
3. **Update Frontend**: Add Render URL to frontend API config
4. **Test CORS**: Ensure frontend can make requests

---

## Common Render Issues & Fixes

### Issue: "Application failed to respond"
- Check logs for missing env vars
- Verify PORT is set correctly
- Ensure MongoDB connection succeeds

### Issue: CORS errors
- Add your Vercel URL to `FRONTEND_URL` env var
- Check CORS middleware in index.js

### Issue: Cold starts (Free tier)
- Free tier spins down after 15 min inactivity
- First request after sleep takes ~30 seconds
- Consider paid tier for production

### Issue: File upload failures
- Render has ephemeral filesystem
- Files in `/tmp/` are deleted on restart
- Cloudinary handles persistent storage (already configured)

---

## Performance Optimization

1. **Enable HTTP/2**: Automatic on Render
2. **Add Compression**: Install `compression` middleware
3. **Database Indexing**: Add indexes to frequently queried fields
4. **Caching**: Consider Redis for session/cache (paid add-on)

---

## Monitoring

- **Logs**: Render Dashboard → Logs tab
- **Metrics**: Monitor response times and errors
- **Alerts**: Set up email alerts for downtime

---

## Security Best Practices

✅ All credentials rotated
✅ JWT secret is strong (32+ chars)
✅ CORS properly configured
✅ MongoDB network access restricted
✅ .env file never committed
✅ HTTPS enabled (automatic on Render)

---

## Rollback Plan

If deployment fails:
1. Check Render logs for errors
2. Verify all env vars are set
3. Test MongoDB connection string locally
4. Redeploy previous working commit

---

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Your Backend URL: `https://<your-service>.onrender.com`
