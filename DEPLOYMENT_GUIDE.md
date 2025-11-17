# 🚀 Deployment Guide - Tasbeeh App

This guide will walk you through deploying your Tasbeeh app to Vercel with Supabase integration.

## Prerequisites

- A GitHub account (or GitLab/Bitbucket)
- A Vercel account (free tier works great)
- A Supabase account (optional, but recommended for data sync)

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Tasbeeh App
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for it to initialize

### 1.2 Run Database Schema

1. Once your project is ready, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the `supabase-schema.sql` file from your project
4. Copy all the SQL code and paste it into the editor
5. Click "Run" to execute the schema
6. You should see success messages for all tables created

### 1.3 Get Your API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll need two values:
   - **Project URL**: `https://zovfpaujeqgvsuobtrtx.supabase.co` (or your project URL)
   - **anon public** key: Copy this long string

Keep these credentials handy for the next step!

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Tasbeeh app"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right, select "New repository"
3. Name it: `tasbeeh-app`
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2.3 Push Your Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/tasbeeh-app.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended for First Time)

#### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`tasbeeh-app`)
4. Vercel will auto-detect it's a Vite project

#### 3.2 Configure Build Settings

The build settings should be auto-detected, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 3.3 Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (from Step 1.3) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (from Step 1.3) |

**Important**: Add these for all environments (Production, Preview, Development)

#### 3.4 Deploy!

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Once done, you'll get a URL like: `https://tasbeeh-app-abc123.vercel.app`

### Method 2: Vercel CLI (For Quick Deployments)

#### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 3.2 Login to Vercel

```bash
vercel login
```

#### 3.3 Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **tasbeeh-app**
- Directory? **./** (current directory)
- Want to override settings? **N**

#### 3.4 Add Environment Variables

```bash
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

#### 3.5 Deploy to Production

```bash
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Enter your domain name
4. Follow the instructions to configure DNS

### 4.2 Update DNS Records

Add the following records to your domain provider:

**For root domain (tasbeeh.com):**
- Type: A
- Name: @
- Value: 76.76.21.21

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

## Step 5: Testing Your Deployment

### 5.1 Test Core Features

Visit your deployed URL and test:

- ✅ Counter increments when tapped
- ✅ Can switch between different dhikr counters
- ✅ Can set goals (33, 99, 100, custom)
- ✅ Progress ring displays correctly
- ✅ Sound effects work (click to test)
- ✅ Can complete sessions
- ✅ Statistics show up correctly
- ✅ Can add/delete custom counters in settings

### 5.2 Test Mobile

1. Open the app on your phone
2. Test haptic feedback (vibration)
3. Verify responsive design works
4. Test offline mode (turn off wifi/data)

### 5.3 Test Supabase Integration

1. Complete a session on one device
2. Open the app on another device (with same browser/account)
3. Verify data syncs (if using Supabase auth)

## Troubleshooting

### Build Fails

**Issue**: Build fails with module errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: App shows "Supabase credentials not found"

**Solution**:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Verify both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Make sure they're added for all environments
4. Redeploy the project

### App Shows Blank Page

**Issue**: Deployed app shows a white screen

**Solution**:
1. Check browser console for errors (F12)
2. Verify the build completed successfully in Vercel logs
3. Check that the output directory is set to `dist`

### Supabase Errors

**Issue**: Database errors or "permission denied"

**Solution**:
1. Verify you ran the complete `supabase-schema.sql` file
2. Check that Row Level Security policies were created
3. Make sure you're using the correct project URL and anon key

## Updating Your App

### Push Updates

```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will automatically deploy your changes!

### Rollback a Deployment

1. Go to Vercel dashboard → Your project → Deployments
2. Find a previous successful deployment
3. Click "..." → "Promote to Production"

## Performance Tips

### 1. Enable Analytics

In Vercel dashboard:
1. Go to your project → Analytics
2. Enable Web Analytics (free)

### 2. Configure Caching

The app automatically uses browser caching via localStorage. No additional configuration needed!

### 3. Set Up Preview Deployments

Every pull request automatically gets a preview URL. Share these with testers before merging to main!

## Security Checklist

- ✅ Never commit `.env` file to GitHub
- ✅ Use environment variables in Vercel for sensitive data
- ✅ Supabase RLS policies are enabled
- ✅ Only expose the anon key (never the service_role key)
- ✅ HTTPS is automatically enabled by Vercel

## Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Create an issue in your repository

---

**Congratulations!** Your Tasbeeh app is now live and ready to help Muslims around the world with their dhikr! 🎉

May Allah accept this effort and make it beneficial. Ameen.
