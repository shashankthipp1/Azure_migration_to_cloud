# 🔧 Azure Deployment Fix Guide

## Issue: "Add or update the Azure App Service build and deploymer workflow config"

This error occurs because Azure needs proper build configuration. Here are two solutions:

---

## ✅ Solution 1: Use Azure's Built-in Build (Oryx) - RECOMMENDED

This is the simplest approach - Azure will automatically detect and build your Node.js app.

### Step 1: Configure Build Settings in Azure Portal

1. Go to your Web App **azuremigration** in Azure Portal
2. Navigate to **Configuration** → **General settings**
3. Set the **Startup Command**:
   ```bash
   npm install && cd client && npm install && npm run build && cd ../server && npm start
   ```
   OR if you want Azure to auto-detect:
   ```
   cd server && npm start
   ```

### Step 2: Configure Build Automation

1. Go to **Configuration** → **General settings**
2. Enable **Build automation**: `ON`
3. Save and restart the app

### Step 3: Set Build Command (Alternative)

In Azure Portal → **Deployment Center** → **Settings**:

**Build Provider**: `GitHub`

**Repository**: Select your repository

**Branch**: `main`

**Build Settings**:
- **Stack**: `Node 18 LTS`
- **Build Command**: 
  ```bash
  npm install && cd client && npm install && npm run build && cd ../server && npm install
  ```
- **Startup Command**:
  ```bash
  cd server && npm start
  ```

---

## ✅ Solution 2: Use GitHub Actions Workflow

This gives you more control over the build process.

### Step 1: Get Publish Profile

1. In Azure Portal, go to your Web App **azuremigration**
2. Click **Get publish profile** (downloads `.PublishSettings` file)
3. Open the file and copy its contents

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository: `Azure_migration_to_cloud`
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire contents of the `.PublishSettings` file
6. Click **Add secret**

### Step 3: Verify Workflow File

The workflow file `.github/workflows/azure-webapps-deploy.yml` should already be in your repo. If not, commit and push it.

### Step 4: Push to Trigger Deployment

```bash
git add .
git commit -m "Add Azure deployment workflow"
git push origin main
```

The workflow will automatically trigger and deploy your app.

---

## 🔍 Verify Build Configuration

After setup, check:

1. **Deployment Center** → **Logs** - Should show successful builds
2. **Configuration** → **General settings** - Verify startup command
3. **Log stream** - Check for runtime errors

---

## 🐛 Troubleshooting

### Build Fails

1. Check **Deployment Center** → **Logs** for specific errors
2. Verify Node.js version matches (18.x)
3. Ensure all dependencies are in `package.json`
4. Check that `client/build` folder is created after build

### App Doesn't Start

1. Check **Log stream** in Azure Portal
2. Verify environment variables are set:
   - `NODE_ENV=production`
   - `PORT=8080` (or Azure's assigned port)
   - `MONGODB_URI=your-connection-string`
   - `JWT_SECRET=your-secret`
   - `FRONTEND_URL=https://azuremigration.azurewebsites.net`

### Frontend Not Loading

1. Verify `client/build` folder exists in deployment
2. Check server.js serves static files correctly
3. Verify `NODE_ENV=production` is set

---

## 📝 Quick Fix Commands

If you have Azure CLI installed:

```bash
# Set startup command
az webapp config set \
  --name azuremigration \
  --resource-group YOUR_RESOURCE_GROUP \
  --startup-file "cd server && npm start"

# Enable build automation
az webapp config appsettings set \
  --name azuremigration \
  --resource-group YOUR_RESOURCE_GROUP \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Restart app
az webapp restart \
  --name azuremigration \
  --resource-group YOUR_RESOURCE_GROUP
```

---

## ✅ Success Indicators

- ✅ Deployment status shows "Success" in Deployment Center
- ✅ Build logs show "Build succeeded"
- ✅ App responds at `https://azuremigration.azurewebsites.net`
- ✅ Health check works: `https://azuremigration.azurewebsites.net/api/health`

