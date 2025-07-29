import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import FileUpload from "./components/FileUpload";
import JobDescriptionInput from "./components/JobDescriptionInput";
import AnalysisResults from "./components/AnalysisResults";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";

// Services
import { apiService } from "./services/api";

// Styles
import "./index.css";

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [apiHealth, setApiHealth] = useState("unknown");

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await apiService.healthCheck();
      setApiHealth("healthy");
    } catch (error) {
      setApiHealth("unhealthy");
      console.error("API health check failed:", error);
    }
  };

  // Handle resume file upload
  const handleResumeUpload = async (file) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Processing your resume...");

      const result = await apiService.uploadResume(file);
      setResumeFile(file);
      setResumeText(result.text_preview);

      toast.success("Resume uploaded successfully!");
      setCurrentStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Handle resume text input
  const handleResumeTextChange = (text) => {
    setResumeText(text);
    if (text.trim() && !resumeFile) {
      setCurrentStep(2);
    }
  };

  // Handle job description input
  const handleJobDescriptionChange = (text) => {
    setJobDescription(text);
  };

  // Handle analysis
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!resumeText.trim() && !resumeFile) {
      toast.error("Please upload a resume or enter resume text");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Analyzing resume match...");

      let results;

      if (resumeFile) {
        // Use file upload analysis if file is available
        results = await apiService.analyzeWithFile(jobDescription, resumeFile);
      } else {
        // Use text analysis
        results = await apiService.analyzeMatch(resumeText, jobDescription);
      }

      setAnalysisResults(results);
      setCurrentStep(3);

      // Show success message with score
      toast.success(
        `Analysis complete! Match score: ${results.overall_score}%`
      );
    } catch (error) {
      toast.error(error.message || "Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Handle starting over
  const handleStartOver = () => {
    setCurrentStep(1);
    setResumeFile(null);
    setResumeText("");
    setJobDescription("");
    setAnalysisResults(null);
    toast.info("Ready for a new analysis!");
  };

  // Handle going back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle continuing to next step
  const handleContinue = () => {
    if (currentStep === 1 && (resumeText.trim() || resumeFile)) {
      setCurrentStep(2);
    } else if (currentStep === 2 && jobDescription.trim()) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <Header apiHealth={apiHealth} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Show only on step 1 */}
        {currentStep === 1 && <Hero />}

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                    currentStep === step
                      ? "bg-primary-600 text-white"
                      : currentStep > step
                      ? "bg-success-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step ? "✓" : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      currentStep > step ? "bg-success-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStep === 1 && "Upload Resume"}
                {currentStep === 2 && "Job Description"}
                {currentStep === 3 && "Analysis Results"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {currentStep === 1 &&
                  "Upload your resume file or paste resume text"}
                {currentStep === 2 &&
                  "Paste the job description you want to match against"}
                {currentStep === 3 &&
                  "Review your match score and improvement suggestions"}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner message={loadingMessage} />}

        {/* Main Content */}
        {!isLoading && (
          <div className="max-w-4xl mx-auto animate-in">
            {/* Step 1: Resume Upload */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <FileUpload
                  onFileUpload={handleResumeUpload}
                  onTextChange={handleResumeTextChange}
                  resumeText={resumeText}
                  resumeFile={resumeFile}
                />

                {(resumeText.trim() || resumeFile) && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleContinue}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      Continue to Job Description
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="btn-secondary px-6 py-3"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim()}
                    className={`px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                      jobDescription.trim()
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Analyze Match
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {currentStep === 3 && analysisResults && (
              <div className="space-y-8">
                <AnalysisResults results={analysisResults} />

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="btn-secondary px-6 py-3"
                  >
                    ← Edit Job Description
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="btn-primary px-8 py-3"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="text-sm"
      />
    </div>
  );
}

export default App;
