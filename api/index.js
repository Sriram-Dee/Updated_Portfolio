import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { Octokit } from "@octokit/rest";
import { v2 as cloudinary } from "cloudinary";
import multiparty from "multiparty";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));

// Environment variables
const {
  JWT_SECRET = "dev-secret-change-in-production",
  ADMIN_PASSWORD_HASH,
  EMAIL_USER,
  EMAIL_PASS,
  CONTACT_TO_EMAIL,
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH,
  GITHUB_DATA_PATH,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

// Local data file path
const LOCAL_DATA_PATH = path.join(__dirname, "..", "server", "data.json");

// Configure Cloudinary (optional)
if (CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

// Configure GitHub client (optional - only if credentials provided)
const useGitHub = !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
const octokit = useGitHub ? new Octokit({ auth: GITHUB_TOKEN }) : null;

console.log(
  `📦 Data storage: ${useGitHub ? "GitHub" : "Local file (server/data.json)"}`,
);

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Helper: Get data from local file
async function getDataFromLocal() {
  try {
    const content = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
    return { data: JSON.parse(content), sha: null };
  } catch (error) {
    if (error.code === "ENOENT") {
      const defaultData = getDefaultData();
      await saveDataToLocal(defaultData);
      return { data: defaultData, sha: null };
    }
    throw error;
  }
}

// Helper: Save data to local file
async function saveDataToLocal(data) {
  await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Helper: Get data from GitHub
async function getDataFromGitHub() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: GITHUB_DATA_PATH || "server/data.json",
      ref: GITHUB_BRANCH || undefined,
    });

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { data: JSON.parse(content), sha: data.sha };
  } catch (error) {
    if (error.status === 404) {
      return { data: getDefaultData(), sha: null };
    }
    throw error;
  }
}

// Helper: Save data to GitHub
async function saveDataToGitHub(data, sha) {
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: GITHUB_DATA_PATH || "server/data.json",
    branch: GITHUB_BRANCH || undefined,
    message: "Update portfolio data",
    content,
    sha: sha || undefined,
  });
}

// Unified data access functions
async function getData() {
  return useGitHub ? getDataFromGitHub() : getDataFromLocal();
}

async function saveData(data, sha) {
  return useGitHub ? saveDataToGitHub(data, sha) : saveDataToLocal(data);
}

// Helper: Get default data structure
function getDefaultData() {
  return {
    profile: {
      name: "Your Name",
      title: "Full Stack Developer",
      email: "hello@example.com",
      location: "Earth",
      summary:
        "Passionate about creating beautiful, functional web experiences.",
      avatar: "",
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    skills: {
      frontend: ["React", "JavaScript", "TypeScript", "CSS", "Tailwind CSS"],
      backend: ["Node.js", "Express", "Python", "PostgreSQL"],
      tools: ["Git", "Docker", "AWS", "Figma"],
    },
    experience: [],
    projects: [],
    education: [],
    achievements: [],
    settings: {
      showEducation: true,
      showAchievements: true,
    },
  };
}

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    storage: useGitHub ? "github" : "local",
  });
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // For development without password hash, accept "admin"
    if (!ADMIN_PASSWORD_HASH) {
      if (password === "admin") {
        const token = jwt.sign({ admin: true }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.json({ token });
      }
      return res.status(401).json({ error: "Invalid password" });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify token
app.post("/api/verify-token", authMiddleware, (req, res) => {
  res.json({ valid: true });
});

// Get portfolio data
app.get("/api/portfolio", async (req, res) => {
  try {
    const { data } = await getData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

// Update portfolio data (protected)
app.post("/api/portfolio", authMiddleware, async (req, res) => {
  try {
    const newData = req.body;

    // Get current SHA for GitHub update
    const { sha } = await getData();

    // Save data
    await saveData(newData, sha);

    res.json({ success: true, message: "Portfolio updated successfully" });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ error: "Failed to update portfolio" });
  }
});

// Upload image (protected)
app.post("/api/upload", authMiddleware, async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!CLOUDINARY_CLOUD_NAME) {
      return res.status(400).json({
        error: "Image uploads require Cloudinary configuration",
      });
    }

    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "portfolio",
        resource_type: "auto",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      });

      res.json({ url: result.secure_url });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email is configured
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.log("Contact form submission (email not configured):", {
        name,
        email,
        message,
      });
      return res.json({
        success: true,
        message: "Message received (email not configured)",
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: EMAIL_USER,
      to: CONTACT_TO_EMAIL || EMAIL_USER,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
