# 🐳 Docker Setup Guide

## Installing Docker Desktop on macOS

### Step 1: Download Docker Desktop

1. Visit [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Click "Download for Mac"
3. Choose the correct version:
   - **Apple Silicon (M1/M2/M3)**: Download "Mac with Apple chip"
   - **Intel Mac**: Download "Mac with Intel chip"

### Step 2: Install Docker Desktop

1. Open the downloaded `.dmg` file
2. Drag Docker icon to Applications folder
3. Launch Docker Desktop from Applications
4. Accept the terms and conditions
5. Docker Desktop will start automatically

### Step 3: Verify Installation

Open Terminal and run:

```bash
docker --version
docker-compose --version
```

You should see version information for both commands.

### Step 4: Start Resume Analyzer

Once Docker is installed and running:

```bash
# Navigate to project directory
cd /Users/jayvora/Desktop/Resume-Analyze

# Start the application
docker-compose up --build
```

## Alternative: Homebrew Installation

If you have Homebrew installed, you can install Docker via command line:

```bash
# Install Docker Desktop via Homebrew
brew install --cask docker

# Start Docker Desktop
open -a Docker
```

Wait for Docker Desktop to fully start (you'll see the Docker whale icon in your menu bar), then verify:

```bash
docker --version
docker-compose --version
```

## Quick Start Commands

After Docker is installed:

```bash
# Navigate to project
cd /Users/jayvora/Desktop/Resume-Analyze

# Build and start all services
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Troubleshooting

### If Docker Desktop won't start:

1. Check System Preferences > Security & Privacy
2. Allow Docker Desktop if blocked
3. Restart your Mac if needed

### If ports are already in use:

```bash
# Stop any processes using ports 3000 or 8000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

### If you get permission errors:

```bash
# Add your user to docker group (may require restart)
sudo dscl . append /Groups/_developer GroupMembership $(whoami)
```

## Development Mode

For local development without Docker:

1. **Backend Setup:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

2. **Frontend Setup (new terminal):**

```bash
cd frontend
npm install
npm start
```

## Next Steps

Once Docker is running:

1. Upload a resume (PDF, DOCX, DOC, or TXT)
2. Paste a job description
3. Get instant analysis and improvement suggestions!
