const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// JWT Secret (use environment variable in production)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Data File Path
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

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

// Routes

// Get Portfolio Data (public)
app.get("/api/portfolio", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read data" });
    }
    res.json(JSON.parse(data));
  });
});

// Update Portfolio Data (protected)
app.post("/api/portfolio", authenticateToken, (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.json({ message: "Data updated successfully", data: newData });
  });
});

// Upload File (protected) - Return relative path
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return relative path only
    const fileUrl = `/uploads/${req.file.filename}`;

    console.log(`File uploaded: ${fileUrl}`); // For debugging
    res.json({ url: fileUrl, filename: req.file.filename });
  }
);

// Serve uploaded files with proper CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Contact Email (public)
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

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

  // In production, store hashed password in environment variable
  const hashedPassword =
    process.env.ADMIN_PASSWORD_HASH ||
    "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // default: "password"

  try {
    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      // Generate JWT token
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

// Verify token endpoint (optional, for frontend to check token validity)
app.get("/api/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Logout endpoint (optional, token revocation would require a token blacklist)
app.post("/api/logout", authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: /uploads/`);

  // Generate default password hash for first-time setup
  if (!process.env.ADMIN_PASSWORD_HASH) {
    const bcrypt = require("bcryptjs");
    const defaultPassword = "admin123";
    bcrypt.hash(defaultPassword, 10).then((hash) => {
      console.log("\n=== FIRST TIME SETUP ===");
      console.log('Default password: "admin123"');
      console.log("Add this to your .env file:");
      console.log(`ADMIN_PASSWORD_HASH=${hash}`);
      console.log("JWT_SECRET=your-super-secret-jwt-key-change-this");
      console.log("=======================\n");
    });
  }
});
