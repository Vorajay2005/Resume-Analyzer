import re
from typing import List, Dict, Set, Tuple, Optional
import logging
from collections import Counter
import math

logger = logging.getLogger(__name__)

class NLPAnalyzer:
    """Simple NLP service - no external ML dependencies"""
    
    def __init__(self):
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
        
        # Common stop words
        self.stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
            'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
            'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
            'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
            'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our',
            'their'
        }
        
        logger.info("Simple NLP Analyzer initialized successfully")
    
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
        """Calculate similarity using simple word overlap and TF-IDF-like scoring"""
        try:
            # Tokenize and clean texts
            resume_words = self._tokenize_and_clean(resume_text.lower())
            job_words = self._tokenize_and_clean(job_description.lower())
            
            if not resume_words or not job_words:
                return 0.0
            
            # Calculate word frequencies
            resume_freq = Counter(resume_words)
            job_freq = Counter(job_words)
            
            # Get unique words from both texts
            all_words = set(resume_words + job_words)
            
            # Calculate simple TF-IDF-like vectors
            resume_vector = []
            job_vector = []
            
            for word in all_words:
                # Simple TF-IDF calculation
                resume_tf = resume_freq.get(word, 0) / len(resume_words)
                job_tf = job_freq.get(word, 0) / len(job_words)
                
                # Simple IDF (inverse document frequency)
                doc_freq = (1 if word in resume_freq else 0) + (1 if word in job_freq else 0)
                idf = math.log(2 / doc_freq) if doc_freq > 0 else 0
                
                resume_vector.append(resume_tf * idf)
                job_vector.append(job_tf * idf)
            
            # Calculate cosine similarity
            similarity = self._cosine_similarity(resume_vector, job_vector)
            
            # Convert to percentage and cap at 100
            return min(similarity * 100, 100.0)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def _tokenize_and_clean(self, text: str) -> List[str]:
        """Tokenize text and remove stop words"""
        # Extract words (alphanumeric + some special chars for tech terms)
        words = re.findall(r'\b[\w\-\.]+\b', text.lower())
        
        # Filter out stop words and very short words
        cleaned_words = [
            word for word in words 
            if len(word) > 2 and word not in self.stop_words
        ]
        
        return cleaned_words
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        
        # Calculate dot product
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        
        # Calculate magnitudes
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(b * b for b in vec2))
        
        # Avoid division by zero
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def extract_keywords(self, text: str, top_n: int = 20) -> List[str]:
        """Extract top keywords using frequency analysis"""
        try:
            words = self._tokenize_and_clean(text)
            word_freq = Counter(words)
            
            # Get top keywords by frequency
            top_keywords = [word for word, freq in word_freq.most_common(top_n)]
            
            return top_keywords
            
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            return []
    
    def analyze_text_structure(self, text: str) -> Dict:
        """Basic text analysis"""
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Word count
        words = self._tokenize_and_clean(text)
        
        # Basic metrics
        return {
            "sentence_count": len(sentences),
            "word_count": len(words),
            "avg_sentence_length": len(words) / len(sentences) if sentences else 0,
            "unique_words": len(set(words)),
            "readability_score": self._calculate_basic_readability(sentences, words)
        }
    
    def _calculate_basic_readability(self, sentences: List[str], words: List[str]) -> float:
        """Basic readability score"""
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