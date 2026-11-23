# Portfolio V2

A modern, stunning portfolio website built with React 19, Vite, and a completely new UI design featuring glassmorphism, bento-grid layouts, and smooth animations.

## ✨ Features

- **Modern Bento-Grid Layout** - Unique grid-based design for visual appeal
- **Glassmorphism Effects** - Beautiful glass-like UI elements with backdrop blur
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Interactive Effects** - Spotlight cards, tilt effects, magnetic buttons, text reveals
- **Responsive Design** - Works seamlessly on all device sizes
- **Admin Dashboard** - Full CRUD operations for all content sections
- **Image Uploads** - Cloudinary integration for image management
- **Contact Form** - Email notifications via Nodemailer
- **GitHub Data Persistence** - Store your data securely in GitHub
- **Vercel Deployment Ready** - Optimized for serverless deployment

## 🛠️ Tech Stack

### Frontend

- React 19 + Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React Icons
- React Router DOM
- Axios

### Backend

- Node.js + Express 5
- JWT Authentication
- Nodemailer (Gmail)
- Cloudinary (Images)
- GitHub API (Data Storage)

### Deployment

- Vercel (Serverless Functions)

## 📁 Project Structure

```
portfolio_v2/
├── api/
│   └── index.js          # Vercel serverless function
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Button, Card, Input, Modal, Badge, etc.
│   │   │   └── effects/  # GradientText, FadeIn, SpotlightCard, etc.
│   │   ├── pages/
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Admin.jsx
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── skillIcons.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css     # Design system & utilities
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── index.js          # Development server
│   ├── data.json         # Local data (for development)
│   └── package.json
├── vercel.json
├── .env.example
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudinary account
- Gmail account (with App Password)
- GitHub Personal Access Token

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd portfolio_v2
```

2. Install dependencies

```bash
npm run install:all
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure environment variables (see below)

5. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_PASSWORD_HASH=your-bcrypt-hashed-password

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
CONTACT_TO_EMAIL=where-to-receive@email.com

# GitHub Data Storage
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
GITHUB_DATA_PATH=data.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Generating Password Hash

```javascript
const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("your-password", 10);
console.log(hash);
```

## 📦 Available Scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Start client & server concurrently |
| `npm run dev:client`  | Start only the Vite dev server     |
| `npm run dev:server`  | Start only the Express server      |
| `npm run build`       | Build client for production        |
| `npm run install:all` | Install all dependencies           |

## 🚀 Deployment to Vercel

1. Push your code to GitHub

2. Connect repository to Vercel

3. Configure build settings:
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `frontend`
   - Install Command: `npm run install:all`

4. Add all environment variables in Vercel dashboard

5. Deploy!

## 🎨 Design System

The design system includes:

- **Colors**: Primary (dark), Accent (purple), Secondary colors
- **Typography**: Inter font with responsive scaling
- **Spacing**: Consistent spacing scale
- **Effects**: Glass, glow, gradient, animations
- **Components**: Button, Card, Input, Modal, Badge, etc.

## 📝 Admin Dashboard

Access the admin panel at `/login`:

- Manage Profile information
- Add/Remove Skills by category
- Create Experience entries
- Upload Project images
- Add Education background
- Track Achievements

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Environment variable configuration
- No sensitive data in client bundle

## 📄 License

MIT License - feel free to use for your own portfolio!

---

Built with ❤️ using React and modern web technologies
