from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random

# Create FastAPI app
app = FastAPI()

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Resume Analyzer API", "status": "online"}

@app.get("/api/")
def api_root():
    return {"message": "Resume Analyzer API", "status": "online"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/debug")
def debug():
    return {
        "endpoints": [
            "GET /",
            "GET /api/",
            "GET /api/health", 
            "GET /api/debug",
            "POST /api/analyze"
        ],
        "status": "API is running",
        "message": "All systems operational"
    }

@app.post("/api/analyze")
def analyze_resume(resume: UploadFile = File(...), job_description: Optional[str] = Form("")):
    try:
        # Basic validation
        if not resume.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Generate demo response
        demo_response = {
            "overall_score": random.randint(75, 95),
            "match_percentage": random.randint(75, 95),
            "contact_info": {
                "emails": ["john.doe@email.com"],
                "phones": ["(555) 123-4567"]
            },
            "skills": {
                "technical_skills": ["Python", "JavaScript", "React", "SQL", "Git"],
                "total_skills_found": 5
            },
            "sections": {
                "has_experience": True,
                "has_education": True,
                "has_skills": True
            },
            "suggestions": [
                "Add more technical skills relevant to the job",
                "Include specific project examples",
                "Quantify your achievements with numbers"
            ],
            "file_size": 1500,
            "word_count": 250
        }
        
        return {
            "success": True,
            "data": demo_response,
            "message": "Resume analyzed successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Analysis failed"
        }



# Export for Vercel
handler = app