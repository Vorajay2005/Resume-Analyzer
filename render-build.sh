#!/bin/bash

echo "🚀 Starting Render Build Process..."
echo "=================================="

# Upgrade pip and install build tools
echo "🔧 Upgrading pip and installing build tools..."
pip install --upgrade pip setuptools wheel

# Install Python dependencies with optimizations
echo "📦 Installing Python dependencies..."
pip install --no-cache-dir --prefer-binary -r requirements-render.txt

# Download spaCy model
echo "🧠 Downloading spaCy English model..."
python -m spacy download en_core_web_sm

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

echo "✅ Build completed successfully!"
echo "🎯 Ready to serve from backend with static files"