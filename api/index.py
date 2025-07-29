import sys
import os

# Add the project root to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.app.main import app

# Export the FastAPI app for Vercel
handler = app