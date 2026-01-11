# Vercel Deployment Guide

## Three Separate Vercel Projects

### 1. Backend (Node.js)
**Deploy:** `/BACKEND` folder

**Environment Variables to add in Vercel:**
```
MONGODB_URI=mongodb+srv://shrikant:3EMYjxbi8cUiGCZN@krutanic.pkdq7.mongodb.net/?retryWrites=true&w=majority&appName=krutanic
PYTHON_SERVICE_URL=https://your-python-scraper.vercel.app
PYTHON_SERVICE_API_KEY=n8FQv4WmP9ZxA7C2yE6DkR5S3JH0UeB1LTaIYgKcMfwOohNrbV
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### 2. Python Job Scraper
**Deploy:** `/python-job-scraper` folder

**Environment Variables to add in Vercel:**
```
API_KEY=n8FQv4WmP9ZxA7C2yE6DkR5S3JH0UeB1LTaIYgKcMfwOohNrbV
NODE_BACKEND_URL=https://your-backend.vercel.app
```

### 3. Frontend
**Deploy:** `/FRONTEND` folder

**Environment Variables to add in Vercel:**
```
VITE_API_URL=https://your-backend.vercel.app
```

## Deployment Steps

1. **Push code to GitHub** (without .env files)
2. **Import each folder as separate project** in Vercel
3. **Add environment variables** in Vercel dashboard for each project
4. **Update URLs** after first deployment with actual Vercel URLs
5. **Redeploy** all projects to pick up updated URLs

## Important Notes
- All .env files are in .gitignore - never commit them
- API keys must match between Backend and Python services
- Update CORS settings after getting production URLs
