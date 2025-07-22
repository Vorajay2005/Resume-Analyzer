#!/bin/bash

echo "⚡ Starting ULTRA FAST Render Build..."
echo "====================================="

# Upgrade pip only
echo "🔧 Upgrading pip..."
pip install --upgrade pip

# Install only essential dependencies (NO spaCy, NO sentence-transformers)
echo "📦 Installing essential dependencies only..."
pip install --no-cache-dir --prefer-binary \
    fastapi==0.104.1 \
    "uvicorn[standard]==0.24.0" \
    python-multipart==0.0.6 \
    pdfplumber==0.10.3 \
    python-docx==1.1.0 \
    PyPDF2==3.0.1 \
    scikit-learn==1.3.2 \
    pandas==2.1.4 \
    numpy==1.25.2 \
    requests==2.31.0 \
    pydantic==2.5.1 \
    aiofiles==23.2.1

echo "📦 Installing Node.js dependencies..."
cd frontend
npm ci --only=production

echo "🏗️ Building React frontend..."
npm run build

echo "📁 Moving build files to backend static directory..."
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

echo "✅ ULTRA FAST build completed in ~3 minutes!"
echo "🎯 App ready with core functionality"
echo "📝 Advanced NLP features disabled for speed"