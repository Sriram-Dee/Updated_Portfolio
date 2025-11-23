# Deploying to Vercel - Complete Guide

This guide will walk you through deploying your portfolio application to Vercel with Cloudinary for file uploads and GitHub for data storage.

## Prerequisites

Before deploying, you need:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
3. **GitHub Personal Access Token**: For data persistence
4. **Gmail App Password**: For contact form functionality

---

## Step-by-Step Deployment

### Step 1: Prepare Your Credentials

#### A. Get Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. After logging in, go to your Dashboard
3. Copy the following credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### B. Create GitHub Personal Access Token

Your portfolio data is stored in `server/data.json` in your GitHub repository. The admin panel updates this file via GitHub API.

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: "Portfolio Data Access"
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

#### C. Generate Admin Password Hash

Run this command to generate a password hash for admin login:

```bash
node -e "require('bcryptjs').hash('your-desired-password', 10).then(console.log)"
```

Copy the output hash - you'll need it for environment variables.

#### D. Get Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

#### E. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 2: Push Your Code to GitHub

Make sure your latest code is pushed to the `dev` branch:

```bash
git add .
git commit -m "Ready for deployment"
git push origin dev
```

**⚠️ Important:** Make sure `server/.env` is NOT committed (it should be in `.gitignore`)

---

### Step 3: Deploy via Vercel Dashboard

#### 3.1 Go to Vercel
1. Visit **https://vercel.com**
2. Sign in with GitHub (or create account)
3. Click **"Add New..."** → **"Project"**

#### 3.2 Import Your Repository
1. Click **"Import Git Repository"**
2. Select **"Import from GitHub"**
3. Find **"Updated_Portfolio"** in the list
4. Click **"Import"**

#### 3.3 Configure Project Settings

On the import screen, configure:

**Framework Preset:** Other (or leave as detected)

**Root Directory:** `./` (leave as default)

**Build Command:**
```
npm run build
```

**Output Directory:**
```
frontend
```

**Install Command:**
```
npm install && npm install --prefix client && npm install --prefix server
```

**Git Branch:** Make sure `dev` is selected

---

### Step 4: Add Environment Variables

Click **"Environment Variables"** section and add all **11 variables**:

| Variable Name | Example Value | Where to Get |
|---------------|---------------|--------------|
| `JWT_SECRET` | `a1b2c3d4e5f6...` | From Step 1E (generate random string) |
| `ADMIN_PASSWORD_HASH` | `$2b$10$KZaE...` | From Step 1C (bcrypt hash) |
| `EMAIL_SERVICE` | `gmail` | Use "gmail" |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `abcd efgh ijkl mnop` | From Step 1D (Gmail app password) |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | From Step 1A (Cloudinary dashboard) |
| `CLOUDINARY_API_KEY` | `123456789012345` | From Step 1A (Cloudinary dashboard) |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnop` | From Step 1A (Cloudinary dashboard) |
| `GITHUB_TOKEN` | `ghp_abc123...` | From Step 1B (GitHub PAT) |
| `GITHUB_OWNER` | `Sriram-Dee` | Your GitHub username |
| `GITHUB_REPO` | `Updated_Portfolio` | Your repository name |

**Important:** 
- Click **"Add"** after each variable
- Make sure all 11 variables are added before deploying
- Double-check there are no typos

---

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait for build to complete (2-5 minutes)
3. Watch the build logs for any errors
4. Once complete, you'll get a URL like: `your-project.vercel.app`

---

### Step 6: Verify Deployment

Test your deployed application:

#### Frontend Tests
- ✅ Visit `yoursite.vercel.app` - Homepage loads
- ✅ Portfolio sections display correctly
- ✅ Contact form is visible

#### API Tests
- ✅ Visit `yoursite.vercel.app/api/portfolio` - Returns JSON data
- ✅ Contact form sends email successfully

#### Admin Tests
- ✅ Visit `yoursite.vercel.app/login` - Login page loads
- ✅ Login with your admin password
- ✅ Upload a test image (goes to Cloudinary)
- ✅ Edit portfolio data and save
- ✅ Check GitHub repo - `server/data.json` should be updated

---

## Project Structure on Vercel

```
updated_portfolio/
├── api/
│   └── index.js           # Serverless function (wraps Express app)
├── client/                # React frontend (builds to frontend/)
├── server/                # Express server with all routes
│   ├── index.js          # Main server file (GitHub + Cloudinary)
│   └── data.json         # Portfolio data (synced with GitHub)
├── frontend/             # Built frontend (created during build)
├── vercel.json           # Vercel configuration
└── package.json          # Root dependencies
```

---

## How It Works on Vercel

### Backend (Serverless)
- Your Express app runs as a **serverless function**
- No server running continuously
- Each API request triggers the function
- Function executes → Returns response → Stops
- All routes work through `api/index.js`

### Frontend (Static)
- Built with Vite to `frontend/` directory
- Served as static files
- API calls routed to serverless function

### Data Flow
```
User Request → Vercel → Routes to:
  - Static files (frontend/) for pages
  - Serverless function (api/index.js) for /api/* routes
    → Express app handles request
    → Returns response
```

---

## Troubleshooting

### Build Fails

**Check build logs in Vercel dashboard**

Common issues:
- Missing dependencies → Check `package.json`
- Wrong build command → Verify `vercel.json`
- Environment variables missing → Add all 11 variables

### API Routes Not Working

- Verify all environment variables are set correctly
- Check API function logs in Vercel dashboard
- Test API endpoint: `yoursite.vercel.app/api/portfolio`

### File Upload Fails

- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for upload logs
- Ensure file size is within limits (10MB default)

### Contact Form Not Sending

- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Review function logs for error messages
- Test with a simple message first

### GitHub Data Updates Not Working

- Verify GitHub token has `repo` scope
- Check that `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Ensure `server/data.json` exists in your repository
- Check GitHub API rate limits (5,000 requests/hour)

### Session Expired Errors

- Regenerate `JWT_SECRET` if needed
- Clear browser cookies and login again
- Check that `ADMIN_PASSWORD_HASH` matches your password

---

## Custom Domain (Optional)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

---

## Important Notes

### Data Persistence
- **File Storage**: All uploaded files are stored in Cloudinary (not local disk)
- **Portfolio Data**: Stored in GitHub (`server/data.json`) and persists across deployments
- **Version Control**: All data changes are committed to GitHub automatically

### Security
- **Never commit `.env` files** to Git
- **Rotate tokens** if accidentally exposed
- **Use strong passwords** for admin access
- **Keep dependencies updated** regularly

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, 100 deployments/day
- **Cloudinary**: 25GB storage + 25GB bandwidth/month
- **GitHub API**: 5,000 requests/hour

### Performance
- **Cold Starts**: First request may be slower (serverless warmup)
- **Function Timeout**: 10 seconds maximum
- **Build Time**: 2-5 minutes typically

---

## Updating Your Deployment

### To Deploy Updates

1. Make changes locally
2. Test thoroughly with `npm run dev:all`
3. Commit and push to `dev` branch:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin dev
   ```
4. Vercel automatically deploys the changes
5. Check deployment status in Vercel dashboard

### To Update Environment Variables

1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Edit or add variables
4. **Redeploy** for changes to take effect

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [GitHub API Documentation](https://docs.github.com/en/rest)

---

## Deployment Checklist

- [ ] All credentials collected (Cloudinary, GitHub, Gmail)
- [ ] Code pushed to `dev` branch
- [ ] `server/.env` NOT in Git
- [ ] Vercel project created
- [ ] All 11 environment variables added
- [ ] Build completed successfully
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] Admin login works
- [ ] File upload works (Cloudinary)
- [ ] Contact form sends email
- [ ] Portfolio data saves to GitHub

---

**Congratulations!** 🎉 Your portfolio is now live on Vercel!

Your site is accessible at: `https://your-project.vercel.app`
