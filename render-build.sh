#!/bin/bash

echo "🚀 Starting Render Build Process..."
echo "=================================="

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Download spaCy model
echo "🧠 Downloading spaCy English model..."
python -m spacy download en_core_web_sm

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd frontend
npm ci

echo "🏗️ Building React frontend..."
npm run build

echo "📁 Moving build files to backend static directory..."
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

echo "✅ Build completed successfully!"
echo "🎯 Ready to serve from backend with static files"