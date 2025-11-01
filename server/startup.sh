#!/bin/bash
# Azure startup script
# Builds the client and starts the server

echo "🚀 Starting Azure deployment process..."

# Build React client
echo "📦 Building React client..."
cd ../client
npm install
npm run build

# Start server
echo "🚀 Starting Node.js server..."
cd ../server
npm install
node server.js

