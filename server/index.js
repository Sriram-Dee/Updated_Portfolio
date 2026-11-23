import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Import the API handler dynamically
const apiModule = await import("../api/index.js");
const apiApp = apiModule.default;

const server = express();

// Enable CORS for development
server.use(cors());

// Mount API routes
server.use(apiApp);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});
