#!/bin/bash
# Build script for Azure App Service deployment
# This script builds the client and installs server dependencies

echo "🚀 Starting build process..."

# Install root dependencies (if any)
echo "📦 Installing root dependencies..."
npm install

# Build React client
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React app..."
npm run build

# Go back to root
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

echo "✅ Build complete!"

