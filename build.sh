#!/bin/bash
# Azure build script for Oryx builder

echo "🚀 Starting Azure build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build React client
echo "📦 Building React client..."
cd client
npm install
npm run build

# Install server dependencies
echo "📦 Installing server dependencies..."
cd ../server
npm install

echo "✅ Build complete!"

