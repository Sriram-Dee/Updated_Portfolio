# Updated Portfolio

A modern, dynamic portfolio website with admin panel for content management.

## Features

- 🎨 Modern, responsive design with React and Tailwind CSS
- 🔐 Secure admin authentication with JWT
- 📧 Contact form with email notifications
- 🖼️ Image upload and management via Cloudinary
- ⚡ Fast deployment on Vercel
- 🎭 Smooth animations with Framer Motion and GSAP

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- Framer Motion
- GSAP
- Three.js

### Backend
- Vercel Serverless Functions
- JWT Authentication
- Nodemailer
- Cloudinary (file storage)

## Getting Started

### Local Development

1. **Install dependencies:**
```bash
npm install
npm run install:all
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```
Edit `.env` with your credentials.

3. **Start development servers:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Project Structure

```
updated_portfolio/
├── api/                    # Vercel serverless functions
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
├── server/                 # Local development server
├── vercel.json            # Vercel configuration
└── package.json           # Root dependencies
```

## Environment Variables

Required environment variables (see `.env.example`):

- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password
- `EMAIL_USER` - Gmail address for contact form
- `EMAIL_PASS` - Gmail app password
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Scripts

- `npm run build` - Build both client and server
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run install:all` - Install all dependencies

## License

MIT
