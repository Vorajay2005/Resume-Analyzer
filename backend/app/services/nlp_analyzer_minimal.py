import re
from typing import List, Dict, Set, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging

logger = logging.getLogger(__name__)

class NLPAnalyzer:
    """Minimal NLP service for resume and job description analysis - Render optimized"""
    
    def __init__(self):
        # Use basic TF-IDF for similarity (no heavy dependencies)
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),
            lowercase=True
        )
        
        # Comprehensive skill categories
        self.skill_categories = {
            "programming_languages": [
                "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby", "go", "rust",
                "swift", "kotlin", "scala", "r", "matlab", "perl", "shell", "bash", "powershell"
            ],
            "web_technologies": [
                "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask",
                "spring", "laravel", "rails", "asp.net", "jquery", "bootstrap", "sass", "less"
            ],
            "databases": [
                "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "oracle", "sql server",
                "sqlite", "cassandra", "dynamodb", "firebase", "neo4j"
            ],
            "cloud_platforms": [
                "aws", "azure", "gcp", "google cloud", "heroku", "digitalocean", "linode",
                "kubernetes", "docker", "terraform", "ansible"
            ],
            "data_science": [
                "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
                "pandas", "numpy", "matplotlib", "seaborn", "jupyter", "tableau", "power bi"
            ],
            "tools_frameworks": [
                "git", "github", "gitlab", "jenkins", "travis ci", "circleci", "jira", "confluence",
                "slack", "teams", "figma", "sketch", "photoshop", "illustrator"
            ]
        }
        
        # Flatten all skills for easy matching
        self.all_skills = set()
        for category_skills in self.skill_categories.values():
            self.all_skills.update([skill.lower() for skill in category_skills])
        
        logger.info("Minimal NLP Analyzer initialized successfully")
    
    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills from text using pattern matching"""
        text_lower = text.lower()
        found_skills = {"found": [], "categories": {}}
        
        # Initialize categories
        for category in self.skill_categories:
            found_skills["categories"][category] = []
        
        # Find skills by pattern matching
        for category, skills in self.skill_categories.items():
            for skill in skills:
                # Use word boundaries for better matching
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills["found"].append(skill)
                    found_skills["categories"][category].append(skill)
        
        return found_skills
    
    def calculate_similarity(self, resume_text: str, job_description: str) -> float:
        """Calculate similarity using TF-IDF and cosine similarity"""
        try:
            # Prepare texts
            texts = [resume_text.lower(), job_description.lower()]
            
            # Calculate TF-IDF vectors
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            
            # Calculate cosine similarity
            similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
            similarity_score = similarity_matrix[0][0]
            
            # Convert to percentage
            return min(similarity_score * 100, 100.0)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def extract_keywords(self, text: str, top_n: int = 20) -> List[str]:
        """Extract top keywords using TF-IDF"""
        try:
            # Fit TF-IDF on the text
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([text.lower()])
            
            # Get feature names and scores
            feature_names = self.tfidf_vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            # Get top keywords
            top_indices = np.argsort(tfidf_scores)[::-1][:top_n]
            keywords = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
            
            return keywords
            
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            return []
    
    def analyze_text_structure(self, text: str) -> Dict:
        """Basic text analysis without spaCy"""
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Word count
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Basic metrics
        return {
            "sentence_count": len(sentences),
            "word_count": len(words),
            "avg_sentence_length": len(words) / len(sentences) if sentences else 0,
            "unique_words": len(set(words)),
            "readability_score": self._calculate_basic_readability(sentences, words)
        }
    
    def _calculate_basic_readability(self, sentences: List[str], words: List[str]) -> float:
        """Basic readability score (simplified Flesch formula)"""
        if not sentences or not words:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        # Simplified score (0-100, higher is more readable)
        score = max(0, min(100, 100 - (avg_sentence_length * 2)))
        return round(score, 2)
    
    def get_skill_suggestions(self, resume_skills: List[str], job_skills: List[str]) -> Dict:
        """Generate skill-based suggestions"""
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        missing_skills = [skill for skill in job_skills if skill.lower() not in resume_skills_lower]
        matching_skills = [skill for skill in job_skills if skill.lower() in resume_skills_lower]
        
        return {
            "missing_skills": missing_skills[:10],  # Top 10 missing
            "matching_skills": matching_skills,
            "match_percentage": (len(matching_skills) / len(job_skills) * 100) if job_skills else 0
        }
    
    def generate_improvement_suggestions(self, resume_text: str, job_description: str) -> List[Dict]:
        """Generate actionable improvement suggestions"""
        suggestions = []
        
        # Extract skills from both texts
        resume_skills = self.extract_skills(resume_text)
        job_skills = self.extract_skills(job_description)
        
        # Skill-based suggestions
        skill_analysis = self.get_skill_suggestions(
            resume_skills["found"], 
            job_skills["found"]
        )
        
        if skill_analysis["missing_skills"]:
            suggestions.append({
                "type": "skills",
                "priority": "high",
                "title": "Add Missing Key Skills",
                "description": f"Consider adding these skills mentioned in the job description: {', '.join(skill_analysis['missing_skills'][:5])}",
                "impact": "high"
            })
        
        # Keyword suggestions
        job_keywords = self.extract_keywords(job_description, 10)
        resume_keywords = self.extract_keywords(resume_text, 10)
        
        missing_keywords = [kw for kw in job_keywords if kw not in resume_text.lower()]
        if missing_keywords:
            suggestions.append({
                "type": "keywords",
                "priority": "medium",
                "title": "Include Relevant Keywords",
                "description": f"Consider incorporating these keywords: {', '.join(missing_keywords[:3])}",
                "impact": "medium"
            })
        
        # Length suggestions
        word_count = len(resume_text.split())
        if word_count < 200:
            suggestions.append({
                "type": "content",
                "priority": "medium",
                "title": "Expand Resume Content",
                "description": "Your resume seems brief. Consider adding more details about your experience and achievements.",
                "impact": "medium"
            })
        elif word_count > 800:
            suggestions.append({
                "type": "content",
                "priority": "low",
                "title": "Consider Condensing",
                "description": "Your resume is quite lengthy. Consider focusing on the most relevant experiences.",
                "impact": "low"
            })
        
        return suggestions[:5]  # Return top 5 suggestions