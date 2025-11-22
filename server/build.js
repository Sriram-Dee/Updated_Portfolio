const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Clean output folder
const outdir = path.resolve(__dirname, "../backend");
if (fs.existsSync(outdir)) {
  fs.rmSync(outdir, { recursive: true });
}

esbuild
  .build({
    entryPoints: ["./index.js"], // Your server entry file
    outdir, // Output to /backend
    platform: "node",
    bundle: true,
    target: ["node18"],
    sourcemap: false,
    minify: false,
    external: [
      "nodemailer", // optional native deps, avoid bundling
      "express", // can also exclude to reduce size
    ],
  })
  .then(() => {
    console.log("⚡ Server build complete!");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
