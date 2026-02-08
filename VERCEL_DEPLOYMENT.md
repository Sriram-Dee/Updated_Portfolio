# Deploying a Specific Branch to Vercel

This guide explains how to deploy your "Version 2" portfolio code to a new branch and configure Vercel to deploy from that specific branch.

## 1. Create and Push a New Branch

First, you need to create a new branch for your v2 code and push it to GitHub.

Open your terminal in the project root (`d:\WebDevelopment\Antigravity\portfolio\portfolio_v2`) and run:

```bash
# 1. Create a new branch named 'v2-portfolio' (or any name you prefer)
git checkout -b v2-portfolio

# 2. Add all your changes
git add .

# 3. Commit your changes
git commit -m "feat: Upgrade to portfolio v2 with admin dashboard"

# 4. Push the new branch to GitHub
git push -u origin v2-portfolio
```

## 2. Configure Vercel to Deploy the New Branch

There are two ways to handle this in Vercel:

1.  **Preview Deployment:** Deploy the branch as a "Preview" URL (perfect for testing).
2.  **Production Deployment:** Change your "Production" branch to `v2-portfolio` (makes `v2-portfolio` your main site).

### Option A: Deploy as Preview (Recommended for Testing)

Vercel automatically deploys every branch you push as a "Preview" deployment.

1.  Go to your **Vercel Dashboard**.
2.  Select your **Portfolio Project**.
3.  Go to the **Deployments** tab.
4.  You should see `v2-portfolio` building automatically (or recently built).
5.  Click on it to view the live Preview URL (e.g., `portfolio-git-v2-portfolio-username.vercel.app`).
6.  **Note:** This will share the same Environment Variables as Production unless you set specific "Preview" variables.

### Option B: Switch Production to New Branch (Make v2 Live)

If you want `v2-portfolio` to be your main live site (mapped to your custom domain):

1.  Go to **Settings** > **Git**.
2.  Under **Production Branch**, click **Edit**.
3.  Change the branch name from `main` (or `master`) to `v2-portfolio`.
4.  Click **Save**.
5.  Go to the **Deployments** tab and redeploy the latest commit from `v2-portfolio` (or just push a new commit to trigger it).

## 3. Environment Variables (Critical for v2)

For your v2 code to work on Vercel (regardless of branch), you MUST ensure the following Environment Variables are set in **Settings** > **Environment Variables**.

Based on your configuration, ensure these are present:

### Required for Data Persistence

| Variable           | Description                             |
| :----------------- | :-------------------------------------- |
| `GITHUB_TOKEN`     | Personal Access Token with `repo` scope |
| `GITHUB_OWNER`     | Your GitHub Username                    |
| `GITHUB_REPO`      | Your Repository Name                    |
| `GITHUB_DATA_PATH` | `server/data.json` (Default for v2)     |

### Required for Logic

| Variable              | Description                              |
| :-------------------- | :--------------------------------------- |
| `JWT_SECRET`          | Secret key for login                     |
| `ADMIN_PASSWORD_HASH` | Hash of admin password                   |
| `CLOUDINARY_...`      | (Cloud Name, API Key, Secret) for images |
| `EMAIL_...`           | (User, App Password) for contact form    |

## 4. Verification

After deployment:

1.  Visit the deployed URL.
2.  Go to `/admin` and try to log in.
3.  Make a change (e.g., update a text field).
4.  Check your GitHub repository to see if `server/data.json` was updated.
