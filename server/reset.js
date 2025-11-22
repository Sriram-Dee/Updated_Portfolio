const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function resetPassword() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage:
  node reset-password.js <new-password>
  
Example:
  node reset-password.js "my-new-secure-password"
    `);
    return;
  }

  const newPassword = args[0];

  if (newPassword.length < 6) {
    console.error("Error: Password must be at least 6 characters long");
    return;
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    // Update .env file
    const envPath = path.join(__dirname, ".env");
    let envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes("ADMIN_PASSWORD_HASH=")) {
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH=${hash}`
      );
    } else {
      envContent += `\nADMIN_PASSWORD_HASH=${hash}`;
    }

    fs.writeFileSync(envPath, envContent);

    console.log(`
✅ Password changed successfully!
New password: ${newPassword}
.env file updated with new hash.

Please restart your server for changes to take effect.
    `);
  } catch (error) {
    console.error("Error changing password:", error);
  }
}

resetPassword();
// run -> node reset.js "newPassword" 