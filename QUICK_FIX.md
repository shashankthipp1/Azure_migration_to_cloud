# 🚨 QUICK FIX FOR AZURE DEPLOYMENT

## Immediate Steps in Azure Portal:

### Step 1: Configure Startup Command
1. Go to **Azure Portal** → **azuremigration** Web App
2. Navigate to: **Configuration** → **General settings**
3. Scroll to **Startup Command**
4. Enter this EXACT command:
   ```bash
   cd server && npm start
   ```
5. **Save** (top of page)

### Step 2: Enable Build Automation
1. In same **Configuration** → **General settings** page
2. Find **Build automation**: Toggle **ON**
3. **Save**

### Step 3: Set Application Settings
Go to **Configuration** → **Application settings** and add/verify:

```
NODE_ENV = production
PORT = 8080
SCM_DO_BUILD_DURING_DEPLOYMENT = true
WEBSITES_PORT = 8080
MONGODB_URI = your-mongodb-connection-string
JWT_SECRET = your-jwt-secret
FRONTEND_URL = https://azuremigration.azurewebsites.net
```

**Save** and restart.

### Step 4: Configure Deployment Center
1. Go to **Deployment Center**
2. Under **Settings** tab:
   - **Source**: GitHub
   - **Organization**: shashankthipp1
   - **Repository**: Azure_migration_to_cloud
   - **Branch**: main
   - **Build Provider**: **App Service build service** (NOT GitHub Actions)
   - Click **Save**

### Step 5: Restart
1. Go to **Overview**
2. Click **Restart**

---

## Alternative: Use GitHub Actions (If above doesn't work)

1. Get **Publish Profile** from Azure Portal
2. Add to GitHub Secrets: `AZURE_WEBAPP_PUBLISH_PROFILE`
3. In Deployment Center → Settings:
   - Set **Build Provider**: **GitHub Actions**
   - Save

Then push any commit to trigger workflow.

---

## Verify:
- Check **Deployment Center** → **Logs** → Should show "Success"
- Visit: https://azuremigration.azurewebsites.net/api/health

