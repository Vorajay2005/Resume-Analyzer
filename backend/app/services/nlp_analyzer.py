import spacy
import re
from typing import List, Dict, Set, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logger = logging.getLogger(__name__)

class NLPAnalyzer:
    """Advanced NLP service for resume and job description analysis"""
    
    def __init__(self):
        try:
            # Load spaCy model
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spaCy model not found. Please install: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Initialize sentence transformer for semantic similarity
        try:
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.warning(f"Could not load sentence transformer: {e}")
            self.sentence_model = None
        
        # Comprehensive skill categories
        self.skill_categories = {
            "programming_languages": [
                "python", "java", "javascript", "c++", "c#", "ruby", "php", "swift", 
                "kotlin", "go", "rust", "scala", "typescript", "r", "matlab", "sql",
                "html", "css", "react", "angular", "vue", "node.js", "django", "flask"
            ],
            "cloud_platforms": [
                "aws", "azure", "gcp", "google cloud", "amazon web services", 
                "microsoft azure", "docker", "kubernetes", "terraform", "ansible"
            ],
            "databases": [
                "mysql", "postgresql", "mongodb", "redis", "elasticsearch", 
                "oracle", "sql server", "sqlite", "cassandra", "dynamodb"
            ],
            "frameworks": [
                "spring", "spring boot", "hibernate", "struts", "laravel", 
                "codeigniter", "express.js", "fastapi", "tornado", "pandas", "numpy"
            ],
            "tools": [
                "git", "jenkins", "jira", "confluence", "tableau", "power bi",
                "excel", "photoshop", "illustrator", "figma", "sketch", "postman"
            ],
            "soft_skills": [
                "leadership", "communication", "teamwork", "project management",
                "problem solving", "analytical", "creative", "adaptable", "organized"
            ],
            "methodologies": [
                "agile", "scrum", "waterfall", "devops", "ci/cd", "tdd", "bdd",
                "lean", "kanban", "safe", "itil", "six sigma"
            ]
        }
        
        # Create flat skill list
        self.all_skills = []
        for category, skills in self.skill_categories.items():
            self.all_skills.extend(skills)
        
        # Common certifications
        self.certifications = [
            "aws certified", "azure certified", "google cloud certified",
            "pmp", "cissp", "cisa", "cism", "comptia", "cisco certified",
            "microsoft certified", "oracle certified", "salesforce certified",
            "scrum master", "safe", "itil", "six sigma"
        ]
        
        # Experience indicators
        self.experience_patterns = [
            r'(\d+)[\+\s]*years?\s*(of\s*)?(experience|exp)',
            r'(\d+)[\+\s]*yrs?\s*(of\s*)?(experience|exp)',
            r'over\s*(\d+)\s*years?',
            r'more than\s*(\d+)\s*years?',
            r'(\d+)\+\s*years?'
        ]
        
        # Job title patterns
        self.job_titles = [
            "software engineer", "software developer", "full stack developer",
            "frontend developer", "backend developer", "devops engineer",
            "data scientist", "data analyst", "machine learning engineer",
            "product manager", "project manager", "scrum master",
            "architect", "senior", "junior", "lead", "principal", "director",
            "manager", "consultant", "analyst", "specialist", "coordinator"
        ]
    
    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills from text categorized by type"""
        text_lower = text.lower()
        found_skills = {category: [] for category in self.skill_categories.keys()}
        
        for category, skills in self.skill_categories.items():
            for skill in skills:
                # Use word boundaries for better matching
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills[category].append(skill)
        
        return found_skills
    
    def extract_experience_years(self, text: str) -> Optional[int]:
        """Extract years of experience from text"""
        text_lower = text.lower()
        max_years = 0
        
        for pattern in self.experience_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                if isinstance(match, tuple):
                    years = int(match[0])
                else:
                    years = int(match)
                max_years = max(max_years, years)
        
        return max_years if max_years > 0 else None
    
    def extract_job_titles(self, text: str) -> List[str]:
        """Extract job titles from text"""
        text_lower = text.lower()
        found_titles = []
        
        for title in self.job_titles:
            if title.lower() in text_lower:
                found_titles.append(title)
        
        return list(set(found_titles))
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract certifications from text"""
        text_lower = text.lower()
        found_certs = []
        
        for cert in self.certifications:
            if cert.lower() in text_lower:
                found_certs.append(cert)
        
        return found_certs
    
    def calculate_semantic_similarity(self, resume_text: str, job_description: str) -> float:
        """Calculate semantic similarity between resume and job description"""
        if not self.sentence_model:
            return 0.0
        
        try:
            # Get embeddings
            resume_embedding = self.sentence_model.encode([resume_text])
            jd_embedding = self.sentence_model.encode([job_description])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(resume_embedding, jd_embedding)[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Error calculating semantic similarity: {e}")
            return 0.0
    
    def find_semantic_matches(self, resume_skills: List[str], jd_skills: List[str]) -> List[Dict[str, str]]:
        """Find semantically similar skills between resume and JD"""
        if not self.sentence_model or not resume_skills or not jd_skills:
            return []
        
        semantic_matches = []
        
        try:
            resume_embeddings = self.sentence_model.encode(resume_skills)
            jd_embeddings = self.sentence_model.encode(jd_skills)
            
            # Calculate similarity matrix
            similarity_matrix = cosine_similarity(resume_embeddings, jd_embeddings)
            
            # Find high similarity matches (threshold > 0.7)
            for i, resume_skill in enumerate(resume_skills):
                for j, jd_skill in enumerate(jd_skills):
                    similarity = similarity_matrix[i][j]
                    if similarity > 0.7 and resume_skill.lower() != jd_skill.lower():
                        semantic_matches.append({
                            "resume_skill": resume_skill,
                            "jd_skill": jd_skill,
                            "similarity": round(float(similarity), 3)
                        })
        except Exception as e:
            logger.error(f"Error finding semantic matches: {e}")
        
        return semantic_matches
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from text using spaCy"""
        if not self.nlp:
            return {"PERSON": [], "ORG": [], "GPE": [], "PRODUCT": []}
        
        doc = self.nlp(text)
        entities = {"PERSON": [], "ORG": [], "GPE": [], "PRODUCT": []}
        
        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].append(ent.text.strip())
        
        # Remove duplicates
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        return entities
    
    def calculate_keyword_density(self, text: str, keywords: List[str]) -> Dict[str, float]:
        """Calculate keyword density in text"""
        text_lower = text.lower()
        word_count = len(text_lower.split())
        densities = {}
        
        for keyword in keywords:
            count = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower))
            densities[keyword] = (count / word_count) * 100 if word_count > 0 else 0.0
        
        return densities
    
    def extract_education_info(self, text: str) -> Dict[str, List[str]]:
        """Extract education information"""
        education_info = {
            "degrees": [],
            "institutions": [],
            "fields_of_study": []
        }
        
        # Common degree patterns
        degree_patterns = [
            r'bachelor[\'s]*\s*(?:of\s*)?(\w+(?:\s+\w+)*)',
            r'master[\'s]*\s*(?:of\s*)?(\w+(?:\s+\w+)*)',
            r'phd?\s*(?:in\s*)?(\w+(?:\s+\w+)*)',
            r'doctorate\s*(?:in\s*)?(\w+(?:\s+\w+)*)',
            r'b\.?[sa]\.?\s*(?:in\s*)?(\w+(?:\s+\w+)*)',
            r'm\.?[sa]\.?\s*(?:in\s*)?(\w+(?:\s+\w+)*)',
        ]
        
        text_lower = text.lower()
        
        for pattern in degree_patterns:
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                education_info["degrees"].append(match.group())
                if match.group(1):
                    education_info["fields_of_study"].append(match.group(1).strip())
        
        # Extract university/college names (basic pattern)
        institution_pattern = r'university|college|institute|school'
        lines = text.split('\n')
        
        for line in lines:
            if re.search(institution_pattern, line.lower()) and len(line.strip()) < 100:
                education_info["institutions"].append(line.strip())
        
        return education_info