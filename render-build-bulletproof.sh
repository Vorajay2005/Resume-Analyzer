#!/bin/bash

echo "🛡️ Starting BULLETPROOF Render Build..."
echo "======================================"

# Upgrade pip
echo "🔧 Upgrading pip..."
pip install --upgrade pip

# Install ONLY packages that have pre-built wheels (no compilation)
echo "📦 Installing bulletproof Python dependencies..."
pip install --no-cache-dir --only-binary=all \
    fastapi==0.104.1 \
    "uvicorn[standard]==0.24.0" \
    python-multipart==0.0.6 \
    pdfplumber==0.10.3 \
    python-docx==1.1.0 \
    requests==2.31.0 \
    pydantic==2.5.1 \
    aiofiles==23.2.1 \
    python-dateutil==2.8.2

echo "📦 Installing Node.js dependencies..."
cd frontend

# Fix package-lock.json issues
echo "🔧 Fixing npm lock file..."
rm -f package-lock.json
npm install --package-lock-only

# Install with exact versions
npm install

echo "🏗️ Building React frontend..."
npm run build

echo "📁 Moving build files to backend static directory..."
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

echo "✅ BULLETPROOF build completed!"
echo "🎯 App ready with core functionality"
echo "📝 Zero compilation - only pre-built packages"