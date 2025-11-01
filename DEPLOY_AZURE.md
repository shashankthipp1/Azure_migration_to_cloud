# 🚀 Deploy to Azure App Service (GitHub Deployment)

This guide will help you deploy your College Management System to Azure App Service directly from GitHub.

## 📋 Prerequisites

1. **Azure Account** - Sign up at [azure.com](https://azure.com) (Free tier available)
2. **GitHub Repository** - Your code should be pushed to GitHub
3. **MongoDB Atlas** - Database connection string ready
4. **Azure CLI** (optional) - For command-line deployment

## 🔧 Step-by-Step Deployment

### Method 1: Azure Portal (Recommended)

#### Step 1: Create Azure Resources

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Web App"** and select **"Web App"**
4. Click **"Create"**

#### Step 2: Configure Web App

Fill in the basic details:
- **Subscription**: Select your subscription
- **Resource Group**: Create new or use existing
- **Name**: Choose a unique name (e.g., `college-management-app`)
- **Publish**: Code
- **Runtime stack**: Node 18 LTS or Node 20 LTS
- **Operating System**: Linux (recommended) or Windows
- **Region**: Choose closest to your users
- **App Service Plan**: Create new (Free tier available for testing)

Click **"Review + create"**, then **"Create"**

#### Step 3: Configure Deployment from GitHub

1. Once the Web App is created, go to **Deployment Center**
2. Select **GitHub** as source
3. Authorize Azure to access your GitHub account
4. Select your repository and branch (usually `main` or `master`)
5. Click **"Save"**

#### Step 4: Configure Build Settings

1. Go to **Configuration** → **General settings**
2. Set **Startup Command**:
   ```bash
   npm install && cd client && npm install && npm run build && cd ../server && npm start
   ```
   OR if you have a build script:
   ```bash
   npm run build && cd server && npm start
   ```

#### Step 5: Configure Environment Variables

Go to **Configuration** → **Application settings** and add:

- `NODE_ENV` = `production`
- `PORT` = `8080` (or leave default for Azure)
- `MONGODB_URI` = `your-mongodb-atlas-connection-string`
- `JWT_SECRET` = `your-super-secret-jwt-key`
- `FRONTEND_URL` = `https://your-app-name.azurewebsites.net`

Click **"Save"** and wait for the app to restart.

#### Step 6: Verify Deployment

1. Go to **Overview** and click the **URL** to visit your app
2. Check health endpoint: `https://your-app-name.azurewebsites.net/api/health`
3. Access the app: `https://your-app-name.azurewebsites.net`

---

### Method 2: Azure CLI (Command Line)

#### Step 1: Login to Azure

```bash
az login
```

#### Step 2: Create Resource Group

```bash
az group create --name rg-college-management --location eastus
```

#### Step 3: Create App Service Plan

```bash
az appservice plan create \
  --name plan-college-management \
  --resource-group rg-college-management \
  --sku FREE \
  --is-linux
```

#### Step 4: Create Web App

```bash
az webapp create \
  --name college-management-app \
  --resource-group rg-college-management \
  --plan plan-college-management \
  --runtime "NODE:18-lts"
```

#### Step 5: Configure Deployment from GitHub

```bash
az webapp deployment source config \
  --name college-management-app \
  --resource-group rg-college-management \
  --repo-url https://github.com/yourusername/your-repo \
  --branch main \
  --manual-integration
```

Or use Azure DevOps:

```bash
az webapp deployment source config \
  --name college-management-app \
  --resource-group rg-college-management \
  --repo-url https://github.com/yourusername/your-repo \
  --branch main \
  --git-token YOUR_GITHUB_TOKEN
```

#### Step 6: Set Build Command

```bash
az webapp config set \
  --name college-management-app \
  --resource-group rg-college-management \
  --startup-file "npm install && cd client && npm install && npm run build && cd ../server && npm start"
```

#### Step 7: Configure App Settings

```bash
az webapp config appsettings set \
  --name college-management-app \
  --resource-group rg-college-management \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    MONGODB_URI="your-mongodb-atlas-uri" \
    JWT_SECRET="your-jwt-secret" \
    FRONTEND_URL="https://college-management-app.azurewebsites.net"
```

#### Step 8: Restart App

```bash
az webapp restart \
  --name college-management-app \
  --resource-group rg-college-management
```

---

## 🔨 Build Configuration

Azure App Service will automatically:
1. Run `npm install` in the root
2. Build the React client
3. Start the Node.js server

Make sure your `server/package.json` has a proper start script.

### Alternative: Custom Build Script

Create a `build.sh` or `build.bat` in the root:

**build.sh (Linux):**
```bash
#!/bin/bash
npm install
cd client
npm install
npm run build
cd ../server
npm install
```

**build.bat (Windows):**
```batch
npm install
cd client
npm install
npm run build
cd ..\server
npm install
```

Then set the startup command to:
```bash
./build.sh && cd server && npm start
```

---

## 🔐 Environment Variables

**Important:** Never commit `.env` files to GitHub. Use Azure App Settings instead.

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `8080` (Azure auto-assigns) |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Strong random string |
| `FRONTEND_URL` | Frontend URL | `https://your-app.azurewebsites.net` |

---

## 📊 Monitoring & Logs

### View Logs:

**Azure Portal:**
1. Go to your Web App
2. Navigate to **Log stream** (real-time) or **Logs** (download)

**Azure CLI:**
```bash
az webapp log tail \
  --name college-management-app \
  --resource-group rg-college-management
```

### Application Insights:

1. Go to **Application Insights** in your Web App
2. Click **Turn on Application Insights**
3. Select or create an Application Insights resource
4. Monitor performance, errors, and usage

---

## 🔄 Continuous Deployment

Once configured, every push to your main branch will automatically:
1. Trigger a deployment
2. Build the application
3. Restart the app with new code

### Manual Deployment:

If automatic deployment fails, you can manually trigger:

**Azure Portal:**
1. Go to **Deployment Center**
2. Click **Sync** or **Redeploy**

**Azure CLI:**
```bash
az webapp deployment source sync \
  --name college-management-app \
  --resource-group rg-college-management
```

---

## 🐛 Troubleshooting

### Build Fails:

1. Check **Deployment Center** → **Logs** for errors
2. Verify all dependencies are in `package.json`
3. Ensure build scripts are correct
4. Check Node.js version compatibility

### App Doesn't Start:

1. Check **Log stream** for runtime errors
2. Verify environment variables are set correctly
3. Ensure `PORT` is correctly configured
4. Check MongoDB connection string

### Frontend Not Loading:

1. Verify React build completed successfully
2. Check that `client/build` folder exists
3. Ensure server serves static files correctly
4. Check browser console for errors

### Database Connection Issues:

1. Verify MongoDB Atlas IP whitelist includes Azure IPs (or `0.0.0.0/0`)
2. Check connection string format
3. Verify MongoDB credentials

---

## 💰 Cost Management

### Free Tier:
- **F1 Free**: Limited CPU/memory, good for testing
- **App Service Plan**: Free tier available

### Recommended for Production:
- **B1 Basic**: ~$13/month (better performance)
- **S1 Standard**: ~$70/month (auto-scaling)

### Clean Up Resources:

```bash
az group delete --name rg-college-management --yes
```

---

## ✅ Verification Checklist

- [ ] Web App created successfully
- [ ] GitHub deployment configured
- [ ] Environment variables set
- [ ] Build completes without errors
- [ ] Health endpoint responds: `/api/health`
- [ ] Frontend loads correctly
- [ ] Login works (admin/admin123)
- [ ] Database connection successful

---

## 🎉 Success!

Your College Management System is now live on Azure!

**Default Login:**
- **Admin**: `admin` / `admin123`
- **Student**: `CSE2024001` / `student123`
- **Teacher**: `john.doe@college.edu` / `teacher123`

---

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Node.js on Azure](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Deployment Best Practices](https://docs.microsoft.com/azure/app-service/deploy-best-practices)

