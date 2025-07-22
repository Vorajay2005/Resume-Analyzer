import React from "react";
import { FileText, Brain, Shield } from "lucide-react";

const Header = ({ apiHealth }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resume Analyzer
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                AI-Powered Job Matching Tool
              </p>
            </div>
          </div>

          {/* Features Badge */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-primary-600" />
              <span>Multi-format Support</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Brain className="w-4 h-4 text-primary-600" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-primary-600" />
              <span>ATS Compatible</span>
            </div>
          </div>

          {/* API Status Indicator */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                apiHealth === "healthy"
                  ? "bg-success-100 text-success-700"
                  : apiHealth === "unhealthy"
                  ? "bg-danger-100 text-danger-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  apiHealth === "healthy"
                    ? "bg-success-500 animate-pulse-slow"
                    : apiHealth === "unhealthy"
                    ? "bg-danger-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="hidden sm:inline">
                {apiHealth === "healthy"
                  ? "System Online"
                  : apiHealth === "unhealthy"
                  ? "System Offline"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Features */}
      <div className="md:hidden bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <FileText className="w-3 h-3 text-primary-600" />
            <span>PDF, DOCX, TXT</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Brain className="w-3 h-3 text-primary-600" />
            <span>AI Analysis</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Shield className="w-3 h-3 text-primary-600" />
            <span>ATS Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
