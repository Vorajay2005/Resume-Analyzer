import React from "react";
import { Brain, FileText, Target, CheckCircle } from "lucide-react";

const LoadingSpinner = ({ message = "Processing..." }) => {
  const loadingSteps = [
    { icon: FileText, label: "Parsing resume content", delay: "0ms" },
    { icon: Brain, label: "Analyzing with AI", delay: "500ms" },
    { icon: Target, label: "Matching requirements", delay: "1000ms" },
    { icon: CheckCircle, label: "Generating suggestions", delay: "1500ms" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Main Spinner */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Analyzing Your Resume
          </h3>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 opacity-50 animate-fade-in"
              style={{
                animationDelay: step.delay,
                animationFillMode: "forwards",
                opacity: 0,
              }}
            >
              <div className="bg-primary-100 p-2 rounded-lg">
                <step.icon className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm text-gray-700">{step.label}</span>
              <div className="flex-1 flex justify-end">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="loading-dots">Processing</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">💡 Did you know?</span> Our AI
            analyzes over 200 data points including skills, experience,
            certifications, and semantic meanings to provide accurate matching
            scores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
