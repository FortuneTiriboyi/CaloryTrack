# Deploy to Netlify Guide

⚠️ **IMPORTANT**: Netlify serverless functions have limitations - data stored in memory will reset on each function cold start. For production, you'll need an external database.

## Quick Deploy (with limitations)

### Option 1: Via Netlify CLI (Recommended for testing)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Follow the prompts:
   - Create & configure a new site: Yes
   - Choose your team
   - Site name: (choose a unique name or leave blank)
   - Publish directory: `.` (current directory)

### Option 2: Via GitHub + Netlify Dashboard

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add Netlify functions"
git push origin main
```

2. Go to [netlify.com](https://netlify.com) and login

3. Click "Add new site" → "Import an existing project"

4. Choose GitHub and select your repository

5. Build settings (should auto-detect from netlify.toml):
   - Build command: (leave empty)
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

6. Click "Deploy site"

## ⚠️ LIMITATIONS of Netlify Functions

The serverless functions I created **store data in memory** which means:
- ❌ Data is lost when functions "sleep" (after ~15 mins of inactivity)
- ❌ No persistent storage
- ✅ Good for testing/demo only

## ✅ PRODUCTION SOLUTION

For real persistent storage, use one of these:

### Option A: Netlify Blobs (Simple, Netlify-native)
Add to package.json:
```json
{
  "dependencies": {
    "@netlify/blobs": "^7.0.0"
  }
}
```

### Option B: External Database (Recommended)
Use these free services:
- **MongoDB Atlas** (free tier, 512MB)
- **PlanetScale** (free MySQL)
- **Supabase** (free PostgreSQL + storage)
- **Firebase** (free tier with Firestore)

### Option C: Render.com Backend + Netlify Frontend
Deploy the Node.js backend to Render.com (free with SQLite persistence), use Netlify for frontend only.

## Which Should You Choose?

**For Demo/Testing**: Use the Netlify functions I created (deploy now!)

**For Production**: 
1. **Easiest**: Deploy to **Render.com** (keeps your current SQLite setup)
2. **Most Scalable**: Use **Supabase** (PostgreSQL + file storage)
3. **Hybrid**: Keep backend on VPS/Render, frontend on Netlify

## Deploy Current Setup to Render.com Instead

If you want persistent data with your current code:

1. Go to [render.com](https://render.com)
2. Create account → New Web Service
3. Connect your GitHub repo
4. Settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add persistent disk: `/opt/render/project/src` (for SQLite)
5. Deploy!

Your app will be live at: `https://your-app.onrender.com`

## Summary

| Platform | Data Persistence | Setup Difficulty | Cost |
|----------|-----------------|------------------|------|
| Netlify Functions (current) | ❌ No | Easy | Free |
| Render.com | ✅ Yes (SQLite) | Easy | Free |
| Netlify + Supabase | ✅ Yes (PostgreSQL) | Medium | Free |
| VPS (Current) | ✅ Yes | Medium | $5/mo |

**Recommendation**: Deploy to **Render.com** for free persistent hosting with zero code changes!
