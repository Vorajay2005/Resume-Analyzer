from typing import Dict, List, Tuple
import logging
from ..models.schemas import (
    SkillMatch, ExperienceMatch, CertificationMatch, 
    MatchBreakdown, DetailedSuggestion, AnalysisResult
)
from .nlp_analyzer import NLPAnalyzer

logger = logging.getLogger(__name__)

class ScoringService:
    """Service for calculating match scores and generating recommendations"""
    
    def __init__(self):
        self.nlp_analyzer = NLPAnalyzer()
        
        # Scoring weights
        self.weights = {
            "skills": 0.5,
            "experience": 0.3,
            "certifications": 0.2
        }
        
        # Skill importance mapping
        self.skill_importance = {
            "programming_languages": "high",
            "cloud_platforms": "high", 
            "databases": "medium",
            "frameworks": "medium",
            "tools": "medium",
            "soft_skills": "low",
            "methodologies": "medium"
        }
    
    def analyze_resume_jd_match(self, resume_text: str, job_description: str) -> AnalysisResult:
        """Main method to analyze resume-JD match and generate comprehensive results"""
        
        # Extract skills from both texts
        resume_skills = self.nlp_analyzer.extract_skills(resume_text)
        jd_skills = self.nlp_analyzer.extract_skills(job_description)
        
        # Calculate skill matches
        skill_matches = self._calculate_skill_matches(resume_skills, jd_skills)
        missing_skills = self._find_missing_skills(resume_skills, jd_skills)
        
        # Calculate experience match
        experience_match = self._calculate_experience_match(resume_text, job_description)
        
        # Calculate certification match
        certification_matches = self._calculate_certification_match(resume_text, job_description)
        
        # Calculate scores
        skills_score = self._calculate_skills_score(skill_matches)
        experience_score = self._calculate_experience_score(experience_match)
        certification_score = self._calculate_certification_score(certification_matches)
        
        # Calculate overall score
        overall_score = (
            skills_score * self.weights["skills"] +
            experience_score * self.weights["experience"] +
            certification_score * self.weights["certifications"]
        )
        
        # Generate match breakdown
        match_breakdown = MatchBreakdown(
            skills_score=round(skills_score, 1),
            experience_score=round(experience_score, 1),
            certification_score=round(certification_score, 1),
            overall_score=round(overall_score, 1)
        )
        
        # Generate detailed suggestions
        suggestions = self._generate_suggestions(
            skill_matches, missing_skills, experience_match, 
            certification_matches, overall_score
        )
        
        # Extract ATS keywords
        ats_keywords = self._extract_ats_keywords(resume_text, job_description)
        
        # Find semantic matches
        all_resume_skills = []
        all_jd_skills = []
        for skills_list in resume_skills.values():
            all_resume_skills.extend(skills_list)
        for skills_list in jd_skills.values():
            all_jd_skills.extend(skills_list)
        
        semantic_matches = self.nlp_analyzer.find_semantic_matches(
            all_resume_skills, all_jd_skills
        )
        
        return AnalysisResult(
            overall_score=round(overall_score, 1),
            match_breakdown=match_breakdown,
            matched_skills=skill_matches,
            missing_skills=missing_skills,
            experience_analysis=experience_match,
            certification_analysis=certification_matches,
            detailed_suggestions=suggestions,
            ats_keywords=ats_keywords,
            semantic_matches=semantic_matches
        )
    
    def _calculate_skill_matches(self, resume_skills: Dict[str, List[str]], 
                                jd_skills: Dict[str, List[str]]) -> List[SkillMatch]:
        """Calculate which skills match between resume and JD"""
        skill_matches = []
        
        for category in resume_skills.keys():
            resume_category_skills = set(skill.lower() for skill in resume_skills[category])
            jd_category_skills = set(skill.lower() for skill in jd_skills[category])
            
            # Find matches
            matched = resume_category_skills.intersection(jd_category_skills)
            
            for skill in resume_skills[category]:
                if skill.lower() in matched:
                    skill_matches.append(SkillMatch(
                        skill=skill,
                        matched=True,
                        importance=self.skill_importance.get(category, "medium"),
                        found_variations=[skill]
                    ))
        
        return skill_matches
    
    def _find_missing_skills(self, resume_skills: Dict[str, List[str]], 
                           jd_skills: Dict[str, List[str]]) -> List[str]:
        """Find skills present in JD but missing from resume"""
        missing_skills = []
        
        for category in jd_skills.keys():
            resume_category_skills = set(skill.lower() for skill in resume_skills[category])
            jd_category_skills = set(skill.lower() for skill in jd_skills[category])
            
            missing = jd_category_skills - resume_category_skills
            missing_skills.extend([skill.title() for skill in missing])
        
        return missing_skills
    
    def _calculate_experience_match(self, resume_text: str, job_description: str) -> ExperienceMatch:
        """Calculate experience match between resume and JD requirements"""
        
        # Extract experience years
        resume_years = self.nlp_analyzer.extract_experience_years(resume_text)
        jd_years = self.nlp_analyzer.extract_experience_years(job_description)
        
        # Extract job titles
        resume_titles = self.nlp_analyzer.extract_job_titles(resume_text)
        jd_titles = self.nlp_analyzer.extract_job_titles(job_description)
        
        # Find matching job titles
        matched_titles = list(set(resume_titles).intersection(set(jd_titles)))
        missing_titles = list(set(jd_titles) - set(resume_titles))
        
        # Determine if experience matches
        experience_matched = True
        if jd_years and resume_years:
            experience_matched = resume_years >= jd_years
        elif jd_years and not resume_years:
            experience_matched = False
        
        return ExperienceMatch(
            required_years=jd_years,
            found_years=resume_years,
            matched=experience_matched,
            job_titles_matched=matched_titles,
            missing_job_titles=missing_titles
        )
    
    def _calculate_certification_match(self, resume_text: str, 
                                     job_description: str) -> List[CertificationMatch]:
        """Calculate certification matches"""
        
        resume_certs = self.nlp_analyzer.extract_certifications(resume_text)
        jd_certs = self.nlp_analyzer.extract_certifications(job_description)
        
        cert_matches = []
        
        for cert in jd_certs:
            matched = cert in resume_certs
            importance = "high" if any(keyword in cert.lower() 
                                    for keyword in ["aws", "azure", "google", "pmp"]) else "medium"
            
            cert_matches.append(CertificationMatch(
                certification=cert,
                matched=matched,
                importance=importance
            ))
        
        return cert_matches
    
    def _calculate_skills_score(self, skill_matches: List[SkillMatch]) -> float:
        """Calculate overall skills score based on matches"""
        if not skill_matches:
            return 0.0
        
        total_weight = 0
        weighted_score = 0
        
        for match in skill_matches:
            weight = {"high": 3, "medium": 2, "low": 1}[match.importance]
            total_weight += weight
            if match.matched:
                weighted_score += weight
        
        return (weighted_score / total_weight) * 100 if total_weight > 0 else 0.0
    
    def _calculate_experience_score(self, experience_match: ExperienceMatch) -> float:
        """Calculate experience score"""
        score = 0.0
        
        # Years of experience (60% weight)
        if experience_match.matched:
            score += 60
        elif experience_match.found_years and experience_match.required_years:
            # Partial credit if close to requirement
            ratio = experience_match.found_years / experience_match.required_years
            score += min(60, ratio * 60)
        
        # Job title matches (40% weight)
        if experience_match.job_titles_matched:
            total_jd_titles = len(experience_match.job_titles_matched) + len(experience_match.missing_job_titles)
            if total_jd_titles > 0:
                title_score = (len(experience_match.job_titles_matched) / total_jd_titles) * 40
                score += title_score
        
        return min(100.0, score)
    
    def _calculate_certification_score(self, cert_matches: List[CertificationMatch]) -> float:
        """Calculate certification score"""
        if not cert_matches:
            return 80.0  # Default good score if no certifications required
        
        total_weight = 0
        weighted_score = 0
        
        for match in cert_matches:
            weight = {"high": 3, "medium": 2, "low": 1}[match.importance]
            total_weight += weight
            if match.matched:
                weighted_score += weight
        
        return (weighted_score / total_weight) * 100 if total_weight > 0 else 0.0
    
    def _generate_suggestions(self, skill_matches: List[SkillMatch], 
                            missing_skills: List[str],
                            experience_match: ExperienceMatch,
                            cert_matches: List[CertificationMatch],
                            overall_score: float) -> List[DetailedSuggestion]:
        """Generate detailed suggestions for resume improvement"""
        
        suggestions = []
        
        # Skills suggestions
        if missing_skills:
            high_priority_skills = missing_skills[:5]  # Top 5 missing skills
            if high_priority_skills:
                suggestions.append(DetailedSuggestion(
                    category="skills",
                    suggestion=f"Add these critical missing skills: {', '.join(high_priority_skills)}",
                    priority="high",
                    specific_action=f"Include {', '.join(high_priority_skills)} in your skills section and provide examples of usage in your experience descriptions."
                ))
        
        # Experience suggestions
        if not experience_match.matched:
            if experience_match.required_years and experience_match.found_years:
                gap = experience_match.required_years - experience_match.found_years
                suggestions.append(DetailedSuggestion(
                    category="experience",
                    suggestion=f"You need {gap} more years of experience for this role",
                    priority="high",
                    specific_action="Highlight relevant projects, internships, or freelance work that demonstrate equivalent experience."
                ))
            elif experience_match.required_years and not experience_match.found_years:
                suggestions.append(DetailedSuggestion(
                    category="experience",
                    suggestion=f"Clearly state your years of experience (requirement: {experience_match.required_years}+ years)",
                    priority="high",
                    specific_action="Add a clear statement of your total years of experience in your summary or experience section."
                ))
        
        if experience_match.missing_job_titles:
            suggestions.append(DetailedSuggestion(
                category="experience",
                suggestion=f"Consider highlighting experience related to: {', '.join(experience_match.missing_job_titles)}",
                priority="medium",
                specific_action="Reframe your job titles or descriptions to align with the required roles if your experience is relevant."
            ))
        
        # Certification suggestions
        missing_certs = [cert.certification for cert in cert_matches if not cert.matched]
        if missing_certs:
            high_priority_certs = [cert for cert in missing_certs if any(keyword in cert.lower() 
                                 for keyword in ["aws", "azure", "google", "pmp"])]
            if high_priority_certs:
                suggestions.append(DetailedSuggestion(
                    category="certifications",
                    suggestion=f"Consider obtaining these certifications: {', '.join(high_priority_certs)}",
                    priority="medium",
                    specific_action="Research and plan to obtain these industry-recognized certifications to strengthen your profile."
                ))
        
        # General ATS suggestions
        if overall_score < 70:
            suggestions.append(DetailedSuggestion(
                category="general",
                suggestion="Your resume needs significant optimization for this job",
                priority="high",
                specific_action="Focus on incorporating more relevant keywords, quantifying achievements, and better aligning your experience with job requirements."
            ))
        elif overall_score < 85:
            suggestions.append(DetailedSuggestion(
                category="general",
                suggestion="Good match! Consider minor optimizations for better alignment",
                priority="low",
                specific_action="Fine-tune keyword usage and ensure all relevant skills and experiences are clearly highlighted."
            ))
        
        return suggestions
    
    def _extract_ats_keywords(self, resume_text: str, job_description: str) -> Dict[str, bool]:
        """Extract and check ATS-friendly keywords"""
        
        # Common ATS keywords to check
        ats_keywords = [
            "managed", "developed", "implemented", "designed", "created", "led", "improved",
            "optimized", "analyzed", "collaborated", "achieved", "delivered", "maintained",
            "coordinated", "supervised", "trained", "mentored", "presented", "negotiated"
        ]
        
        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()
        
        keyword_status = {}
        
        # Extract important keywords from JD
        jd_words = set(jd_lower.split())
        important_jd_words = [word for word in jd_words 
                            if len(word) > 4 and word not in ["that", "with", "from", "this", "have", "will", "would"]]
        
        # Check ATS action words
        for keyword in ats_keywords:
            keyword_status[keyword] = keyword in resume_lower
        
        # Check important JD words in resume
        for word in important_jd_words[:10]:  # Top 10 important words
            if word.isalpha():  # Only alphabetic words
                keyword_status[word] = word in resume_lower
        
        return keyword_status