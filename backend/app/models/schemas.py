from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class SkillMatch(BaseModel):
    skill: str
    matched: bool
    importance: str = Field(..., regex="^(high|medium|low)$")

class MatchBreakdown(BaseModel):
    skills_score: float = Field(..., ge=0, le=100)
    experience_score: float = Field(..., ge=0, le=100)
    certification_score: float = Field(..., ge=0, le=100)

class SemanticMatch(BaseModel):
    resume_skill: str
    jd_skill: str
    similarity: float = Field(..., ge=0, le=1)

class ExperienceAnalysis(BaseModel):
    matched: bool
    required_years: Optional[int] = None
    found_years: Optional[int] = None

class Suggestion(BaseModel):
    category: str
    priority: str = Field(..., regex="^(high|medium|low)$")
    suggestion: str
    specific_action: str

class AnalysisResponse(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    match_breakdown: MatchBreakdown
    matched_skills: List[SkillMatch]
    missing_skills: List[str]
    detailed_suggestions: List[Suggestion]
    ats_keywords: Dict[str, bool]
    semantic_matches: List[SemanticMatch]
    experience_analysis: Optional[ExperienceAnalysis] = None

class UploadResponse(BaseModel):
    message: str
    filename: str
    text_preview: str
    word_count: int
    char_count: int

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    version: str

class SkillsResponse(BaseModel):
    programming_languages: List[str]
    web_technologies: List[str]
    databases: List[str]
    cloud_platforms: List[str]
    data_science: List[str]

class StatsResponse(BaseModel):
    total_analyses: int
    average_score: float
    supported_formats: List[str]
    max_file_size: str
    avg_processing_time: str