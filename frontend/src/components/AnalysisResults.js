import React, { useState } from "react";
import {
  Trophy,
  Target,
  Brain,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  FileText,
  Users,
  Calendar,
} from "lucide-react";
import { scoreUtils } from "../services/api";

const AnalysisResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    suggestions: true,
    skills: true,
    experience: true,
    certifications: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-success-600";
    if (score >= 70) return "text-primary-600";
    if (score >= 50) return "text-warning-600";
    return "text-danger-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 85) return "bg-success-500";
    if (score >= 70) return "bg-primary-500";
    if (score >= 50) return "bg-warning-500";
    return "bg-danger-500";
  };

  const ScoreCircle = ({ score, label, size = "large" }) => {
    const radius = size === "large" ? 45 : 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div
        className={`flex flex-col items-center ${
          size === "large" ? "space-y-3" : "space-y-2"
        }`}
      >
        <div className="relative">
          <svg
            className={size === "large" ? "w-24 h-24" : "w-18 h-18"}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={getScoreColor(score)}
              style={{
                transition: "stroke-dashoffset 1s ease-in-out",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`${
                size === "large" ? "text-2xl" : "text-lg"
              } font-bold ${getScoreColor(score)}`}
            >
              {Math.round(score)}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <div
            className={`${
              size === "large" ? "text-sm" : "text-xs"
            } font-medium text-gray-900`}
          >
            {label}
          </div>
          <div
            className={`${
              size === "large" ? "text-xs" : "text-xs"
            } text-gray-500`}
          >
            {scoreUtils.getScoreDescription(score).split(".")[0]}
          </div>
        </div>
      </div>
    );
  };

  const PriorityBadge = ({ priority }) => (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${scoreUtils.getPriorityColor(
        priority
      )}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );

  return (
    <div className="space-y-8">
      {/* Header with Overall Score */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Analysis Complete!
          </h2>
          <p className="text-gray-600">
            Here's how your resume matches the job description
          </p>
        </div>

        {/* Main Score Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-8">
            <ScoreCircle score={results.overall_score} label="Overall Match" />

            <div className="space-y-4">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  results.overall_score >= 85
                    ? "bg-success-100 text-success-800"
                    : results.overall_score >= 70
                    ? "bg-primary-100 text-primary-800"
                    : results.overall_score >= 50
                    ? "bg-warning-100 text-warning-800"
                    : "bg-danger-100 text-danger-800"
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                {
                  scoreUtils
                    .getScoreDescription(results.overall_score)
                    .split(".")[0]
                }
              </div>

              <div className="text-sm text-gray-600 max-w-xs">
                {scoreUtils.getScoreDescription(results.overall_score)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <ScoreCircle
            score={results.match_breakdown.skills_score}
            label="Skills Match"
            size="medium"
          />
        </div>
        <div className="card text-center">
          <ScoreCircle
            score={results.match_breakdown.experience_score}
            label="Experience Match"
            size="medium"
          />
        </div>
        <div className="card text-center">
          <ScoreCircle
            score={results.match_breakdown.certification_score}
            label="Certifications"
            size="medium"
          />
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { key: "overview", label: "Overview", icon: Target },
              { key: "skills", label: "Skills Analysis", icon: Brain },
              { key: "suggestions", label: "Recommendations", icon: Zap },
              { key: "keywords", label: "ATS Keywords", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {results.matched_skills.filter((s) => s.matched).length}
                  </div>
                  <div className="text-sm text-primary-700">Skills Matched</div>
                </div>
                <div className="bg-warning-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-warning-600">
                    {results.missing_skills.length}
                  </div>
                  <div className="text-sm text-warning-700">Skills Missing</div>
                </div>
                <div className="bg-success-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {Object.values(results.ats_keywords).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-success-700">ATS Keywords</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {results.semantic_matches.length}
                  </div>
                  <div className="text-sm text-indigo-700">
                    Semantic Matches
                  </div>
                </div>
              </div>

              {/* Experience Analysis */}
              {results.experience_analysis && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Experience Analysis
                  </h3>
                  <div className="space-y-3">
                    {results.experience_analysis.required_years && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Years Required:</span>
                        <span className="font-medium">
                          {results.experience_analysis.required_years}+ years
                        </span>
                      </div>
                    )}
                    {results.experience_analysis.found_years && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Years Found:</span>
                        <span className="font-medium">
                          {results.experience_analysis.found_years} years
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Experience Match:</span>
                      <span
                        className={`font-medium flex items-center ${
                          results.experience_analysis.matched
                            ? "text-success-600"
                            : "text-warning-600"
                        }`}
                      >
                        {results.experience_analysis.matched ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" /> Meets
                            Requirements
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-1" /> Needs
                            Improvement
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills Analysis Tab */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              {/* Matched Skills */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
                  Matched Skills (
                  {results.matched_skills.filter((s) => s.matched).length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.matched_skills
                    .filter((s) => s.matched)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          skill.importance === "high"
                            ? "bg-success-100 text-success-800"
                            : skill.importance === "medium"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {skill.skill}
                        {skill.importance === "high" && (
                          <Star className="w-3 h-3 ml-1" />
                        )}
                      </span>
                    ))}
                </div>
              </div>

              {/* Missing Skills */}
              {results.missing_skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <X className="w-5 h-5 mr-2 text-danger-600" />
                    Missing Skills ({results.missing_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missing_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-danger-50 text-danger-700 border border-danger-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Matches */}
              {results.semantic_matches.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                    Semantic Matches ({results.semantic_matches.length})
                  </h3>
                  <div className="space-y-3">
                    {results.semantic_matches.map((match, index) => (
                      <div key={index} className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-indigo-900 font-medium">
                              "{match.resume_skill}"
                            </span>
                            <span className="text-indigo-400">≈</span>
                            <span className="text-sm text-indigo-700">
                              "{match.jd_skill}"
                            </span>
                          </div>
                          <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                            {Math.round(match.similarity * 100)}% match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "suggestions" && (
            <div className="space-y-6">
              {results.detailed_suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-6 border-l-4 ${
                    suggestion.priority === "high"
                      ? "bg-danger-50 border-danger-500"
                      : suggestion.priority === "medium"
                      ? "bg-warning-50 border-warning-500"
                      : "bg-success-50 border-success-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          suggestion.priority === "high"
                            ? "bg-danger-100"
                            : suggestion.priority === "medium"
                            ? "bg-warning-100"
                            : "bg-success-100"
                        }`}
                      >
                        {suggestion.category === "skills" && (
                          <Brain className="w-4 h-4" />
                        )}
                        {suggestion.category === "experience" && (
                          <Users className="w-4 h-4" />
                        )}
                        {suggestion.category === "certifications" && (
                          <Award className="w-4 h-4" />
                        )}
                        {suggestion.category === "general" && (
                          <Target className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-1 ${
                            suggestion.priority === "high"
                              ? "text-danger-900"
                              : suggestion.priority === "medium"
                              ? "text-warning-900"
                              : "text-success-900"
                          }`}
                        >
                          {suggestion.suggestion}
                        </h4>
                        <p
                          className={`text-sm ${
                            suggestion.priority === "high"
                              ? "text-danger-700"
                              : suggestion.priority === "medium"
                              ? "text-warning-700"
                              : "text-success-700"
                          }`}
                        >
                          {suggestion.specific_action}
                        </p>
                      </div>
                    </div>
                    <PriorityBadge priority={suggestion.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ATS Keywords Tab */}
          {activeTab === "keywords" && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                These keywords are important for passing Applicant Tracking
                Systems (ATS). Make sure your resume includes the highlighted
                terms.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-success-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
                    Found Keywords
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(results.ats_keywords)
                      .filter(([_, found]) => found)
                      .map(([keyword, _], index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 bg-success-50 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-success-600" />
                          <span className="text-success-900 font-medium">
                            {keyword}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-danger-900 mb-4 flex items-center">
                    <X className="w-5 h-5 mr-2 text-danger-600" />
                    Missing Keywords
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(results.ats_keywords)
                      .filter(([_, found]) => !found)
                      .map(([keyword, _], index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 bg-danger-50 rounded-lg"
                        >
                          <X className="w-4 h-4 text-danger-600" />
                          <span className="text-danger-900 font-medium">
                            {keyword}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
