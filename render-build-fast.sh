#!/bin/bash

echo "🚀 Starting FAST Render Build Process..."
echo "========================================"

# Upgrade pip
echo "🔧 Upgrading pip..."
pip install --upgrade pip

# Install minimal dependencies first (fast build)
echo "📦 Installing minimal Python dependencies..."
pip install --no-cache-dir --prefer-binary -r requirements-minimal.txt

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd frontend
npm ci --only=production

echo "🏗️ Building React frontend..."
npm run build

echo "📁 Moving build files to backend static directory..."
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

echo "✅ Fast build completed successfully!"
echo "🎯 App will run with basic NLP features"
echo "📝 Advanced features can be added later"