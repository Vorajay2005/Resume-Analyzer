from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import io
import re
from typing import Optional
from datetime import datetime
import PyPDF2
from docx import Document
import textdistance

app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis and job matching API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Constants
MAX_FILE_SIZE = 4 * 1024 * 1024  # 4MB for Vercel
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")

def analyze_resume_simple(resume_text: str, job_description: str = "") -> dict:
    """Simple resume analysis without ML dependencies"""
    
    # Basic text cleaning
    resume_text = resume_text.lower().strip()
    job_description = job_description.lower().strip()
    
    # Extract basic information
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    
    emails = re.findall(email_pattern, resume_text, re.IGNORECASE)
    phones = re.findall(phone_pattern, resume_text)
    
    # Simple skill extraction (common tech skills)
    tech_skills = [
        'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'html', 'css',
        'git', 'docker', 'kubernetes', 'aws', 'azure', 'machine learning', 'ai',
        'data science', 'mongodb', 'postgresql', 'mysql', 'tensorflow', 'pytorch'
    ]
    
    found_skills = []
    for skill in tech_skills:
        if skill in resume_text:
            found_skills.append(skill.title())
    
    # Calculate simple match score if job description provided
    match_score = 85  # Default good score
    if job_description:
        # Simple text similarity
        similarity = textdistance.jaro_winkler(resume_text[:1000], job_description[:1000])
        match_score = int(similarity * 100)
    
    # Generate analysis results
    return {
        "overall_score": match_score,
        "match_percentage": match_score,
        "contact_info": {
            "emails": emails[:1],  # First email found
            "phones": phones[:1]   # First phone found
        },
        "skills": {
            "technical_skills": found_skills[:10],  # Top 10 skills
            "total_skills_found": len(found_skills)
        },
        "sections": {
            "has_experience": "experience" in resume_text or "work" in resume_text,
            "has_education": "education" in resume_text or "degree" in resume_text,
            "has_skills": len(found_skills) > 0
        },
        "suggestions": [
            "Add more technical skills relevant to the job",
            "Include specific project examples",
            "Quantify your achievements with numbers",
            "Ensure contact information is clearly visible"
        ],
        "analysis_date": datetime.now().isoformat(),
        "file_size": len(resume_text),
        "word_count": len(resume_text.split())
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.post("/api/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: Optional[str] = Form("")
):
    """Analyze resume against job description"""
    
    # Validate file
    if not resume.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_ext = os.path.splitext(resume.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_ext} not supported. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    file_content = await resume.read()
    
    # Check file size
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File size exceeds {MAX_FILE_SIZE/1024/1024:.1f}MB limit"
        )
    
    # Extract text based on file type
    try:
        if file_ext == ".pdf":
            resume_text = extract_text_from_pdf(file_content)
        elif file_ext in [".docx", ".doc"]:
            resume_text = extract_text_from_docx(file_content)
        elif file_ext == ".txt":
            resume_text = file_content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        # Analyze resume
        analysis_result = analyze_resume_simple(resume_text, job_description or "")
        
        return JSONResponse(content={
            "success": True,
            "data": analysis_result,
            "message": "Resume analyzed successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Resume Analyzer API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }

# Export for Vercel
handler = app