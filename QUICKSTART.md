# 🚀 Quick Start - Local Development

## Setup (One-time)

1. **Copy environment template:**
   ```bash
   copy server\.env.template server\.env
   ```

2. **Edit `server\.env` and add your credentials:**
   - **Cloudinary** (required): Get from [cloudinary.com/console](https://cloudinary.com/console)
   - **Gmail** (required): Get app password from [Google Account](https://myaccount.google.com/apppasswords)
   - **GitHub** (optional): Leave empty for local file storage

3. **Install dependencies:**
   ```bash
   npm install
   npm run install:all
   ```

## Run Development Servers

**Option 1: Run both servers together (Recommended)**
```bash
npm run dev:all
```

**Option 2: Run servers separately**

Terminal 1:
```bash
npm run dev:server
```

Terminal 2:
```bash
npm run dev:client
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/login

## Default Admin Credentials

The default password hash in `.env.template` corresponds to a bcrypt-hashed password.
To create your own password, run:
```bash
node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
```

## Environment Variables

### Required for Local Development:
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard  
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Gmail app password

### Optional for Local Development:
- `GITHUB_TOKEN` - Leave empty to use local file storage
- `GITHUB_OWNER` - Leave empty to use local file storage
- `GITHUB_REPO` - Leave empty to use local file storage

## Testing Checklist

- [ ] Frontend loads at http://localhost:5173
- [ ] Can login to admin panel
- [ ] Can upload images (goes to Cloudinary)
- [ ] Can edit profile, skills, experience, projects
- [ ] Changes save successfully
- [ ] Contact form sends email

## Troubleshooting

**Backend won't start:**
- Check `server/.env` exists and has Cloudinary credentials

**Upload fails:**
- Verify Cloudinary credentials in `server/.env`
- Check you're logged in to admin panel

**Contact form fails:**
- Verify Gmail app password is correct
- Ensure 2FA is enabled on Gmail

## Need More Help?

See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for detailed setup instructions.
