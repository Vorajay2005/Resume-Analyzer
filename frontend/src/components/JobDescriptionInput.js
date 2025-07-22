import React, { useState } from "react";
import {
  Briefcase,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

const JobDescriptionInput = ({ value, onChange }) => {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e) => {
    const text = e.target.value;
    onChange(text);
    setWordCount(
      text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    );
  };

  const isValidLength = value.trim().length >= 100;
  const hasKeywords =
    /skills|experience|requirements|qualifications|responsibilities/i.test(
      value
    );

  const getSuggestionColor = (isValid) => {
    return isValid ? "text-success-600" : "text-warning-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Job Description
        </h2>
        <p className="text-gray-600">
          Paste the complete job description you want to match against
        </p>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">Job Description</span>
            {isValidLength && hasKeywords && (
              <CheckCircle className="w-4 h-4 text-success-600" />
            )}
          </div>

          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Paste the complete job description here...

Include:
• Job title and company information
• Required skills and technologies
• Experience requirements
• Education and certifications
• Job responsibilities
• Preferred qualifications

The more detailed the job description, the more accurate the analysis will be."
            className="w-full h-80 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm leading-relaxed"
          />

          <div className="absolute bottom-3 right-3 flex items-center space-x-4 text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>{value.length} characters</span>
          </div>
        </div>

        {/* Validation Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isValidLength ? "bg-success-500" : "bg-warning-500"
                }`}
              />
              <span className={getSuggestionColor(isValidLength)}>
                Minimum length: {isValidLength ? "Met" : "Need 100+ characters"}
              </span>
            </div>
            <span className="text-gray-500">{value.length}/100 characters</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                hasKeywords ? "bg-success-500" : "bg-warning-500"
              }`}
            />
            <span className={getSuggestionColor(hasKeywords)}>
              Key sections:{" "}
              {hasKeywords ? "Found" : "Include skills, requirements, etc."}
            </span>
          </div>
        </div>

        {/* Quality Indicator */}
        {value.trim() && (
          <div
            className={`rounded-xl p-4 border ${
              isValidLength && hasKeywords
                ? "bg-success-50 border-success-200"
                : "bg-warning-50 border-warning-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              {isValidLength && hasKeywords ? (
                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    isValidLength && hasKeywords
                      ? "text-success-900"
                      : "text-warning-900"
                  }`}
                >
                  {isValidLength && hasKeywords
                    ? "Job Description Ready"
                    : "Improve Job Description Quality"}
                </h4>
                <p
                  className={`text-sm ${
                    isValidLength && hasKeywords
                      ? "text-success-700"
                      : "text-warning-700"
                  }`}
                >
                  {isValidLength && hasKeywords
                    ? "Your job description contains sufficient detail for accurate analysis."
                    : "Add more details about requirements, skills, and responsibilities for better matching accuracy."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Example/Tips Section */}
      {!value.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            What Makes a Good Job Description for Analysis?
          </h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Specific Requirements:</span> List
                exact skills, technologies, and years of experience needed
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Clear Responsibilities:</span>{" "}
                Describe day-to-day tasks and project expectations
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Education & Certifications:</span>{" "}
                Mention required degrees and professional certifications
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Company Context:</span> Include
                information about team size, industry, and work environment
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Job Description */}
      {!value.trim() && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Sample Job Description Structure:
          </h4>
          <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded-lg border">
            <div>
              <strong>Senior Software Engineer - React/Node.js</strong>
            </div>
            <div className="text-gray-500">
              Company Name | Location | Full-time
            </div>
            <br />
            <div>
              <strong>Requirements:</strong>
            </div>
            <div>• 5+ years of experience in full-stack development</div>
            <div>• Expert knowledge of React.js, Node.js, TypeScript</div>
            <div>• Experience with AWS, Docker, MongoDB</div>
            <div>• Bachelor's degree in Computer Science or related field</div>
            <br />
            <div>
              <strong>Responsibilities:</strong>
            </div>
            <div>• Design and implement scalable web applications</div>
            <div>• Collaborate with cross-functional teams</div>
            <div>• Mentor junior developers...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionInput;
