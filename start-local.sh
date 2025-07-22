#!/bin/bash

# Resume Analyzer - Local Development Startup Script
echo "🚀 Starting Resume Analyzer - Local Development Mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

echo "✅ Python $(python3 --version) found"
echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"

# Create uploads directory
mkdir -p uploads

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait
    echo "👋 Services stopped successfully"
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
echo "📦 Starting Backend API Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start backend in background
cd /Users/jayvora/Desktop/Resume-Analyze/backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! curl -s http://localhost:8000/health >/dev/null; then
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend API running at http://localhost:8000"
echo "✅ API Documentation available at http://localhost:8000/docs"

echo ""
echo "🌐 Starting Frontend React Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start frontend in background
cd /Users/jayvora/Desktop/Resume-Analyze/frontend
npm start &
FRONTEND_PID=$!

echo "⏳ Waiting for frontend to start..."
sleep 5

echo ""
echo "🎉 Resume Analyzer is now running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Access Points:"
echo "   Frontend App:     http://localhost:3000"
echo "   Backend API:      http://localhost:8000"
echo "   API Docs:         http://localhost:8000/docs"
echo ""
echo "📁 Upload Directory: ./uploads/"
echo ""
echo "💡 How to use:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Upload your resume (PDF, DOCX, DOC, or TXT)"
echo "   3. Paste the job description"
echo "   4. Get instant analysis and suggestions!"
echo ""
echo "⏹️  Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for user interrupt
wait