# 🚀 Production Deployment Plan - Step by Step

## 📋 **OVERVIEW**
This guide will help you deploy your UniCraft waitlist application to production servers using free hosting services.

## 🎯 **DEPLOYMENT STRATEGY**
- **Frontend**: Netlify (Free static hosting)
- **Backend**: Render.com (Free Python hosting)
- **Database**: SQLite (included with Render)

---

## 📁 **STEP 1: Prepare Files for GitHub**

### **1.1 Create .gitignore files**

**Backend/.gitignore:**
```
# Django
*.log
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**Frontend/waitlist/.gitignore:**
```
# Logs
*.log

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### **1.2 Update Configuration for Production**

**Backend/unimentor/settings.py** - Add production settings:
```python
import os

# Production settings
if os.environ.get('ENVIRONMENT') == 'production':
    DEBUG = False
    ALLOWED_HOSTS = ['your-backend-domain.onrender.com', 'your-custom-domain.com']
    
    # Use environment variables for secrets
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    GOOGLE_OAUTH2_CLIENT_ID = os.environ.get('GOOGLE_OAUTH2_CLIENT_ID')
    GOOGLE_OAUTH2_CLIENT_SECRET = os.environ.get('GOOGLE_OAUTH2_CLIENT_SECRET')
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://your-frontend-domain.netlify.app')
else:
    # Development settings (current)
    DEBUG = True
    ALLOWED_HOSTS = ["*"]
```

**Frontend/waitlist/index.html** - Update URLs:
```javascript
// Configuration - UPDATE THESE FOR PRODUCTION
const BACKEND_URL = 'https://your-backend-domain.onrender.com';  // Your Render URL
const FRONTEND_URL = 'https://your-frontend-domain.netlify.app';  // Your Netlify URL
const GOOGLE_CLIENT_ID = '831572567080-lobf0ngus9qh6712lo0f622hgbsqts8v.apps.googleusercontent.com';
```

**Frontend/waitlist/auth/callback.html** - Update URLs:
```javascript
// Configuration - UPDATE THESE FOR PRODUCTION
const BACKEND_URL = 'https://your-backend-domain.onrender.com';  // Your Render URL
const FRONTEND_URL = 'https://your-frontend-domain.netlify.app';  // Your Netlify URL
```

---

## 🐙 **STEP 2: Upload to GitHub**

### **2.1 Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `unicraft-waitlist`
4. Make it **Public** (for free hosting)
5. Don't initialize with README (we have files already)

### **2.2 Upload Files**
```bash
# Initialize git in your project root
cd "D:\Desktop\EC Projects\UniCraft"
git init
git add .
git commit -m "Initial commit - UniCraft waitlist with Google OAuth"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/unicraft-waitlist.git
git branch -M main
git push -u origin main
```

---

## 🚀 **STEP 3: Deploy Backend to Render.com**

### **3.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### **3.2 Deploy Backend**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Choose your `unicraft-waitlist` repository
4. Configure the service:
   - **Name**: `unicraft-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT`

### **3.3 Configure Environment Variables**
In Render dashboard, go to your service → Environment tab:

```
ENVIRONMENT=production
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
GOOGLE_OAUTH2_CLIENT_ID=831572567080-lobf0ngus9qh6712lo0f622hgbsqts8v.apps.googleusercontent.com
GOOGLE_OAUTH2_CLIENT_SECRET=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
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

### **3.4 Get Render URL**
After deployment, Render will give you a URL like:
`https://unicraft-backend.onrender.com`

**Save this URL - you'll need it for frontend configuration!**

---

## 🌐 **STEP 4: Deploy Frontend to Netlify**

### **4.1 Create Netlify Account**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Connect your GitHub account

### **4.2 Deploy Frontend**
1. Click "New site from Git"
2. Choose GitHub
3. Select your `unicraft-waitlist` repository
4. Configure build settings:
   - **Base directory**: `Frontend/waitlist`
   - **Build command**: (leave empty - static files)
   - **Publish directory**: `Frontend/waitlist`

### **4.3 Update Frontend URLs**
After Netlify gives you a URL (like `https://amazing-name-123456.netlify.app`):

1. **Update Frontend files** with production URLs:
   - `Frontend/waitlist/index.html`
   - `Frontend/waitlist/auth/callback.html`

2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update URLs for production"
   git push
   ```

3. **Netlify will auto-deploy** the changes

---

## 🔧 **STEP 5: Update Google Cloud Console**

### **5.1 Add Production URLs**
Go to [Google Cloud Console](https://console.cloud.google.com):

1. Go to "Credentials" → Your OAuth 2.0 Client ID
2. Add these **Authorized redirect URIs**:
   ```
   https://your-backend-domain.onrender.com/api/users/auth/google/callback/
   ```
3. Add **Authorized JavaScript origins**:
   ```
   https://your-frontend-domain.netlify.app
   https://your-backend-domain.onrender.com
   ```

---

## 🧪 **STEP 6: Test Production**

### **6.1 Test the Complete Flow**
1. Go to your Netlify frontend URL
2. Click "Join Waitlist with Google"
3. Complete Google OAuth
4. Should redirect to congratulations page

### **6.2 Check Backend Logs**
In Railway dashboard, check logs for any errors.

---

## 📊 **STEP 7: Monitor and Maintain**

### **7.1 Render Monitoring**
- Check Render dashboard for uptime
- Monitor logs for errors
- Set up alerts if needed

### **7.2 Netlify Monitoring**
- Check Netlify dashboard for build status
- Monitor form submissions (if you add analytics)

---

## 🔄 **STEP 8: Future Updates**

### **8.1 Update Process**
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Railway and Netlify auto-deploy

### **8.2 Database Backups**
Railway provides automatic backups, but you can also:
- Export data: `python manage.py dumpdata > backup.json`
- Import data: `python manage.py loaddata backup.json`

---

## 💰 **COST BREAKDOWN**

### **Free Tier Limits:**
- **Render**: 750 hours/month (enough for small apps)
- **Netlify**: 100GB bandwidth/month (plenty for static sites)
- **Google OAuth**: Free for reasonable usage

### **If You Need More:**
- **Render Starter**: $7/month for always-on service
- **Netlify Pro**: $19/month for more features

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

1. **CORS Errors**: Check `CORS_ALLOW_ALL_ORIGINS = True` in settings
2. **404 on OAuth**: Verify redirect URI in Google Console
3. **Build Failures**: Check Render logs for Python errors
4. **Frontend Not Loading**: Check Netlify build logs

### **Debug Commands:**
```bash
# Check Render logs (in Render dashboard)
# Go to your service → Logs tab

# Test backend locally with production settings
ENVIRONMENT=production python manage.py runserver
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Files uploaded to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Environment variables set
- [ ] Google Console updated
- [ ] Production URLs updated
- [ ] End-to-end testing completed
- [ ] Monitoring set up

---

## 🎉 **YOU'RE LIVE!**

Once everything is deployed and tested, your UniCraft waitlist will be live and ready to collect users!

**Your URLs will be:**
- Frontend: `https://your-name.netlify.app`
- Backend: `https://your-backend.onrender.com`

**Share your waitlist URL and start collecting signups!** 🚀
