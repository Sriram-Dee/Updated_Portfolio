# Local Development Setup Guide

## Environment Files Location

For **local development**, create a `.env` file in the **`server/`** directory:

```
server/.env  ← Backend uses this file for local development
```

## Step-by-Step Setup

### 1. Create `server/.env` File

Navigate to the `server/` directory and create a `.env` file with the following content:

```bash
# Server Port
PORT=5000

# JWT Authentication
JWT_SECRET=your-local-dev-secret-key-12345
ADMIN_PASSWORD_HASH=$2b$10$KZaEznHSVE2CV47msLZBdukeXc4KfplY.AiVcXSv2cd4c0VSaBpUm

# Email Configuration (for contact form testing)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary Configuration
# Sign up at https://cloudinary.com (free tier)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# GitHub Configuration (OPTIONAL for local dev)
# Leave empty to use local file storage instead of GitHub
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
```

### 2. Get Your Credentials

#### A. Cloudinary (Required for file uploads)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
5. Paste them in your `server/.env` file

#### B. Gmail App Password (Required for contact form)
1. Go to your Google Account
2. Enable 2-Factor Authentication
3. Go to **Security** → **App passwords**
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Paste in `EMAIL_PASS` in your `server/.env` file
7. Update `EMAIL_USER` with your Gmail address

#### C. Admin Password (Already set)
The default password hash is already included:
- **Default Password**: The hash in the example corresponds to a bcrypt-hashed password
- To create your own password hash, run:
  ```bash
  node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
  ```

#### D. GitHub (Optional for local dev)
**For local development, you can leave GitHub variables empty!**
- If empty, the app will use `server/data.json` locally
- If you want to test GitHub integration locally, create a personal access token:
  1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
  2. Generate new token (classic)
  3. Select scope: **repo**
  4. Copy token and paste in `GITHUB_TOKEN`
  5. Add your GitHub username to `GITHUB_OWNER`
  6. Add repository name to `GITHUB_REPO`

### 3. Start Development Servers

Open **two terminals**:

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Server will start on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173`

### 4. Test the Application

1. **Visit Frontend**: Open `http://localhost:5173`
2. **Test Login**: Click login and use the default password (check your hash or use the one you generated)
3. **Test Upload**: 
   - Login to admin panel
   - Go to Profile tab
   - Upload a profile image (will go to Cloudinary)
4. **Test Contact Form**: Fill and submit the contact form (email will be sent via Gmail)

## How It Works Locally

### With GitHub Variables Empty (Recommended for local dev):
```
Frontend (localhost:5173)
    ↓
Vite Proxy → Backend (localhost:5000)
    ├── Data: server/data.json (local file)
    └── Uploads: Cloudinary (cloud storage)
```

### With GitHub Variables Filled:
```
Frontend (localhost:5173)
    ↓
Vite Proxy → Backend (localhost:5000)
    ├── Data: GitHub API → server/data.json (synced with repo)
    └── Uploads: Cloudinary (cloud storage)
```

## Troubleshooting

### Backend won't start
- Check if `.env` file exists in `server/` directory
- Verify all required variables are set (at minimum: Cloudinary credentials)

### Upload fails
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for errors
- Ensure you're logged in to admin panel

### Contact form fails
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Look at server console for error messages

### Data not saving
- If GitHub variables are empty: Check `server/data.json` file permissions
- If GitHub variables are set: Verify GitHub token has `repo` scope

## Quick Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts and loads portfolio data
- [ ] Can login to admin panel
- [ ] Can upload profile image (Cloudinary)
- [ ] Can add/edit skills, experience, projects
- [ ] Can save changes
- [ ] Contact form sends email
- [ ] Changes persist after server restart

## Environment Variables Summary

| Variable | Required | Purpose | Where to get |
|----------|----------|---------|--------------|
| `PORT` | No | Server port (default: 5000) | Any port number |
| `JWT_SECRET` | Yes | JWT token encryption | Any random string |
| `ADMIN_PASSWORD_HASH` | Yes | Admin login password | Use bcrypt to hash |
| `EMAIL_USER` | Yes | Gmail address | Your Gmail |
| `EMAIL_PASS` | Yes | Gmail app password | Google Account settings |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloud storage | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | Cloud storage | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | Cloud storage | Cloudinary dashboard |
| `GITHUB_TOKEN` | No* | Data persistence | GitHub settings |
| `GITHUB_OWNER` | No* | Data persistence | Your GitHub username |
| `GITHUB_REPO` | No* | Data persistence | Repository name |

\* Optional for local development - leave empty to use local file storage

---

**Ready to start!** Once you've set up `server/.env`, run both servers and test the application locally.
