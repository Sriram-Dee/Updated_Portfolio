# Deploying to Vercel - Complete Guide

This guide will walk you through deploying your portfolio application to Vercel with Cloudinary for file uploads and GitHub for data storage.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
3. **GitHub Personal Access Token**: For data persistence
4. **Gmail App Password**: For contact form functionality

## Step 1: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. After logging in, go to your Dashboard
3. Copy the following credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Create GitHub Personal Access Token

Your portfolio data is stored in `server/data.json` in your GitHub repository. The admin panel updates this file via GitHub API.

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: "Portfolio Data Access"
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

## Step 3: Generate Admin Password Hash

Run this command to generate a password hash for admin login:

```bash
node -e "require('bcryptjs').hash('your-desired-password', 10).then(console.log)"
```

Copy the output hash - you'll need it for environment variables.

## Step 4: Get Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your project directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? (press Enter for default)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend`
   - **Install Command**: `npm install && npm install --prefix client`

## Step 5: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `JWT_SECRET` | (generate random string) | Secret key for JWT tokens |
| `ADMIN_PASSWORD_HASH` | (from Step 3) | Hashed admin password |
| `EMAIL_SERVICE` | `gmail` | Email service provider |
| `EMAIL_USER` | your-email@gmail.com | Your Gmail address |
| `EMAIL_PASS` | (from Step 4) | Gmail app password |
| `CLOUDINARY_CLOUD_NAME` | (from Step 1) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | (from Step 1) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | (from Step 1) | Cloudinary API secret |
| `GITHUB_TOKEN` | (from Step 2) | GitHub personal access token |
| `GITHUB_OWNER` | your-github-username | Your GitHub username |
| `GITHUB_REPO` | updated_portfolio | Repository name |

> **Tip**: To generate a secure JWT_SECRET, run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

## Step 6: Redeploy

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or click **Redeploy** in the Vercel dashboard.

## Step 7: Test Your Deployment

1. Visit your deployed URL (e.g., `your-project.vercel.app`)
2. Test the contact form
3. Login to admin panel with your password
4. Test file upload functionality

## Project Structure

```
updated_portfolio/
├── api/
│   └── index.js           # Vercel entry point (wraps Express app)
├── client/                # React frontend
├── server/                # Express server with all routes
│   ├── index.js          # Main server file (GitHub + Cloudinary integrated)
│   └── data.json         # Portfolio data (synced with GitHub)
├── vercel.json            # Vercel configuration
└── package.json           # Root dependencies
```

## Local Development

For local development, use the Express server:

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed
- Verify `vercel.json` configuration
- Check build logs in Vercel dashboard

### API Routes Not Working
- Verify environment variables are set correctly
- Check API function logs in Vercel dashboard
- Ensure CORS headers are properly configured

### File Upload Fails
- Verify Cloudinary credentials
- Check Cloudinary dashboard for upload logs
- Ensure file size is within limits

### Contact Form Not Sending
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail
- Review function logs for error messages

### GitHub Data Updates Not Working
- Verify GitHub token has `repo` scope
- Check that GITHUB_OWNER and GITHUB_REPO are correct
- Ensure `server/data.json` exists in your repository

## Custom Domain (Optional)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

## Important Notes

- **File Storage**: All uploaded files are stored in Cloudinary (not local disk)
- **Data Persistence**: Portfolio data is stored in GitHub (`server/data.json`) and persists across deployments
- **Security**: Never commit `.env` file to Git
- **Free Tier Limits**: 
  - Vercel: 100GB bandwidth/month
  - Cloudinary: 25GB storage + 25GB bandwidth/month
  - GitHub API: 5,000 requests/hour

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- Check the implementation plan for technical details

---

**Congratulations!** 🎉 Your portfolio is now deployed on Vercel!
