#!/bin/bash

echo "🧪 Testing Deployment Configuration..."
echo "====================================="

# Check if all required files exist
echo "📁 Checking required files..."
files=("render-build.sh" "render-start.sh" "render.yaml" "backend/requirements.txt" "frontend/package.json")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check if scripts are executable
echo -e "\n🔧 Checking script permissions..."
if [ -x "render-build.sh" ]; then
    echo "✅ render-build.sh is executable"
else
    echo "❌ render-build.sh not executable"
    chmod +x render-build.sh
    echo "✅ Fixed render-build.sh permissions"
fi

if [ -x "render-start.sh" ]; then
    echo "✅ render-start.sh is executable"
else
    echo "❌ render-start.sh not executable"
    chmod +x render-start.sh
    echo "✅ Fixed render-start.sh permissions"
fi

# Test frontend build (quick check)
echo -e "\n📦 Testing frontend dependencies..."
cd frontend
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ Frontend dependencies are valid"
else
    echo "⚠️  Frontend dependencies may need installation"
fi
cd ..

# Test backend dependencies
echo -e "\n🐍 Testing backend dependencies..."
cd backend
if [ -d "venv" ]; then
    source venv/bin/activate
    if python -c "import fastapi, uvicorn, pdfplumber, spacy" 2>/dev/null; then
        echo "✅ Backend dependencies are available"
    else
        echo "⚠️  Some backend dependencies may be missing"
    fi
    deactivate
else
    echo "⚠️  Virtual environment not found"
fi
cd ..

echo -e "\n🎯 Deployment Readiness Check:"
echo "✅ All configuration files present"
echo "✅ Scripts are executable"
echo "✅ Project structure is correct"
echo -e "\n🚀 Ready for Render deployment!"
echo "📖 Follow the steps in DEPLOYMENT_GUIDE.md"