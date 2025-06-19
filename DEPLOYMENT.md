# WhatRef.ai Deployment Guide

This guide will help you deploy your WhatRef.ai application to make it publicly accessible.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **OpenAI API Key** - Your existing `sk-proj-` key
3. **Domain (Optional)** - You can use free subdomains provided by hosting services

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - **RECOMMENDED**

This is the easiest and most cost-effective option for getting started.

#### Step 1: Prepare Your Repository

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

#### Step 2: Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select "backend" folder as root directory

3. **Set Environment Variables:**
   - Go to your project → Variables tab
   - Add these variables:
     ```
     OPENAI_API_KEY=sk-proj-your-actual-key-here
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-domain.vercel.app
     ```

4. **Deploy:**
   - Railway will automatically build and deploy
   - Note your backend URL (e.g., `https://your-app-name.railway.app`)

#### Step 3: Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import Project:**
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set root directory to `frontend`

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     ```

5. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://your-app-name.vercel.app`

#### Step 4: Update CORS Settings

1. **Update Backend Environment:**
   - Go back to Railway
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Redeploy if necessary

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Backend on Heroku:

1. **Install Heroku CLI**
2. **Create Heroku App:**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=sk-proj-your-key-here
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend.netlify.app
   ```

4. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Frontend on Netlify:

1. **Sign up at [Netlify.com](https://netlify.com)**
2. **Drag and drop your `frontend/build` folder** (after running `npm run build`)
3. **Or connect GitHub** for automatic deployments

### Option 3: Full AWS/Google Cloud (Advanced)

For high-traffic applications, consider:
- **Frontend:** AWS S3 + CloudFront or Google Cloud Storage
- **Backend:** AWS EC2/Lambda or Google Cloud Run
- **Database:** AWS RDS or Google Cloud SQL (if you add user accounts)

## Post-Deployment Checklist

### 1. Test Your Application
- [ ] Upload test images
- [ ] Verify AI analysis works
- [ ] Check "Guess Again" functionality
- [ ] Test on mobile devices

### 2. Monitor Performance
- [ ] Check Railway/Heroku logs for errors
- [ ] Monitor API usage and costs
- [ ] Set up error tracking (optional)

### 3. Security Considerations
- [ ] Verify CORS settings are correct
- [ ] Ensure API keys are not exposed in frontend
- [ ] Consider rate limiting for production use

### 4. Optional Enhancements
- [ ] Custom domain name
- [ ] SSL certificate (usually automatic)
- [ ] Analytics tracking
- [ ] User authentication
- [ ] Database for persistent history

## Cost Estimates

### Free Tier (Recommended for Testing):
- **Railway:** $0/month (500 hours free)
- **Vercel:** $0/month (100GB bandwidth)
- **OpenAI API:** ~$0.01-0.10 per image analysis
- **Total:** ~$5-20/month depending on usage

### Paid Tier (For Production):
- **Railway:** $5/month
- **Vercel Pro:** $20/month
- **OpenAI API:** Variable based on usage
- **Custom Domain:** $10-15/year

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` matches your actual frontend domain
   - Check that both HTTP and HTTPS are handled correctly

2. **API Key Issues:**
   - Verify OpenAI API key is correctly set in backend environment
   - Check API key has sufficient credits

3. **Build Failures:**
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

4. **Image Upload Issues:**
   - Verify file size limits (5MB default)
   - Check supported image formats

### Getting Help:

1. **Check deployment logs** in Railway/Vercel dashboard
2. **Test API endpoints** directly using tools like Postman
3. **Monitor browser console** for frontend errors

## Domain Setup (Optional)

### Custom Domain:
1. **Purchase domain** from registrar (Namecheap, GoDaddy, etc.)
2. **Configure DNS:**
   - Point domain to Vercel/Netlify
   - Add CNAME records as instructed
3. **Update environment variables** with new domain

## Scaling Considerations

As your app grows:
- **Add database** for user accounts and persistent history
- **Implement caching** for repeated image analyses
- **Add rate limiting** to prevent abuse
- **Consider CDN** for faster image loading
- **Monitor costs** and optimize API usage

## Security Best Practices

1. **Environment Variables:** Never commit API keys to Git
2. **HTTPS Only:** Ensure all traffic uses SSL
3. **Input Validation:** Validate file types and sizes
4. **Rate Limiting:** Prevent API abuse
5. **Error Handling:** Don't expose sensitive error details

---

## Quick Start Commands

```bash
# 1. Prepare for deployment
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Build frontend locally (optional test)
cd frontend
npm run build

# 3. Test backend locally
cd backend
npm start
```

Your WhatRef.ai application will be live and accessible to the public once deployed! 🚀 