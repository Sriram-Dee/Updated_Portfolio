const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const multiparty = require("multiparty");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GitHub Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // Your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO; // Repository name
const GITHUB_FILE_PATH = "server/data.json"; // Path to data file in repo

// Data File Path (for local development)
const DATA_FILE = path.join(__dirname, "data.json");

// Helper: Fetch data from GitHub
async function fetchDataFromGitHub() {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    // Fallback to local file if GitHub not configured
    console.log("GitHub not configured, using local file");
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    // Fallback to local file
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }
}

// Helper: Update data in GitHub
async function updateDataInGitHub(newData) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    // Fallback to local file if GitHub not configured
    console.log("GitHub not configured, saving to local file");
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    return;
  }

  try {
    // Get current file SHA
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const currentFile = await getResponse.json();
    const sha = currentFile.sha;

    // Update file
    const content = Buffer.from(JSON.stringify(newData, null, 2)).toString(
      "base64"
    );

    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update portfolio data via admin panel",
          content: content,
          sha: sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      console.error("GitHub API error details:", errorData);
      throw new Error(`GitHub API error: ${updateResponse.statusText} - ${JSON.stringify(errorData)}`);
    }

    console.log("Portfolio data updated in GitHub successfully");
  } catch (error) {
    console.error("Error updating GitHub:", error);
    throw error; // Re-throw error instead of trying to write to local file
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Rate limiting for contact form (server-side protection)
const contactRateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const MAX_REQUESTS = 1; // 1 request per window

const checkRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (contactRateLimiter.has(ip)) {
    const { count, firstRequest } = contactRateLimiter.get(ip);
    
    if (now - firstRequest < RATE_LIMIT_WINDOW) {
      if (count >= MAX_REQUESTS) {
        const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - firstRequest)) / 1000);
        return res.status(429).json({ 
          error: `Too many requests. Please wait ${remainingTime} seconds.` 
        });
      }
      contactRateLimiter.set(ip, { count: count + 1, firstRequest });
    } else {
      // Reset if window expired
      contactRateLimiter.set(ip, { count: 1, firstRequest: now });
    }
  } else {
    contactRateLimiter.set(ip, { count: 1, firstRequest: now });
  }
  
  next();
};

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of contactRateLimiter.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      contactRateLimiter.delete(ip);
    }
  }
}, 300000);

// Routes

// Get Portfolio Data (public)
app.get("/api/portfolio", async (req, res) => {
  try {
    const data = await fetchDataFromGitHub();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

// Update Portfolio Data (protected)
app.post("/api/portfolio", authenticateToken, async (req, res) => {
  try {
    const newData = req.body;
    await updateDataInGitHub(newData);
    res.json({ message: "Data updated successfully", data: newData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Upload File to Cloudinary (protected)
app.post("/api/upload", authenticateToken, (req, res) => {
  // Check Cloudinary configuration
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return res.status(500).json({ error: "Cloudinary configuration missing" });
  }

  // Parse multipart form data
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Failed to parse upload" });
    }

    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file[0];

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "portfolio",
        resource_type: "auto",
      });

      console.log(`File uploaded to Cloudinary: ${result.secure_url}`);

      res.json({
        url: result.secure_url,
        filename: result.public_id,
        cloudinary_id: result.public_id,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
});


// Contact Email (public with rate limiting)
app.post("/api/contact", checkRateLimit, async (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    return res.status(400).json({ error: "Name must be 2-50 characters" });
  }

  if (message.trim().length < 10 || message.trim().length > 1000) {
    return res.status(400).json({ error: "Message must be 10-1000 characters" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email credentials not found in .env");
    return res
      .status(500)
      .json({ error: "Server email configuration missing" });
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Admin Login with JWT
app.post("/api/login", async (req, res) => {
  const { password } = req.body;

  const hashedPassword =
    process.env.ADMIN_PASSWORD_HASH ||
    "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      const token = jwt.sign({ userId: "admin", role: "admin" }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.json({
        token,
        user: { id: "admin", role: "admin" },
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during authentication" });
  }
});

// Verify token endpoint
app.get("/api/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Logout endpoint
app.post("/api/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GitHub Storage: ${GITHUB_TOKEN ? "Enabled" : "Disabled (using local file)"}`);
    console.log(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? "Configured" : "Not configured"}`);
  });
}

// Export for Vercel
module.exports = app;
