#!/bin/bash

echo "🚀 Starting Resume Analyzer on Render..."
echo "======================================="

# Change to backend directory
cd backend

# Start the FastAPI server
echo "🌐 Starting FastAPI server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT