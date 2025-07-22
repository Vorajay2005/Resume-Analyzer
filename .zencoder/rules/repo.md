# Resume Analyzer Project

## Overview

Resume Analyzer is an AI-powered web application that enables job seekers to assess how well their resumes match a given job description (JD). It calculates an accurate match score and provides detailed, actionable suggestions to optimize the resume for a higher chance of selection.

## Technology Stack

- **Backend**: Python 3.11+ with FastAPI
- **Text Parsing**: pdfplumber, python-docx
- **NLP**: spaCy, scikit-learn, sentence-transformers
- **Frontend**: React.js
- **Deployment**: Docker-ready

## Project Structure

```
Resume-Analyze/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── uploads/
├── README.md
└── docker-compose.yml
```

## Core Features

1. Resume and JD Upload (PDF/DOCX/Text)
2. Accurate Match Score Calculation
3. Detailed Suggestions and Recommendations
4. Skills & Keyword Analysis
5. Semantic Understanding using NLP
