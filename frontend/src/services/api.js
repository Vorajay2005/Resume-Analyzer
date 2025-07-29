import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000"),
  timeout: 60000, // 60 seconds timeout for file processing
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 413) {
      throw new Error(
        "File too large. Please select a file smaller than 10MB."
      );
    } else if (error.response?.status === 422) {
      throw new Error(
        "Invalid file format. Please upload PDF, DOCX, or TXT files only."
      );
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  }
);

// API methods
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get("/health");
    return response.data;
  },

  // Upload and analyze resume file
  async uploadResume(file, jobDescription = "") {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    const response = await api.post("/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Alias for compatibility
  async analyzeResume(file, jobDescription = "") {
    return this.uploadResume(file, jobDescription);
  },

  // Legacy method for compatibility
  async analyzeMatch(resumeText, jobDescription, resumeFile = null) {
    if (resumeFile) {
      return this.uploadResume(resumeFile, jobDescription);
    }

    // If no file, create a text file
    const textFile = new File([resumeText], "resume.txt", {
      type: "text/plain",
    });
    return this.uploadResume(textFile, jobDescription);
  },
};

// Utility functions for file handling
export const fileUtils = {
  // Validate file type
  isValidFileType(file) {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    return (
      validTypes.includes(file.type) ||
      file.name.match(/\.(pdf|docx|doc|txt)$/i)
    );
  },

  // Validate file size (10MB limit)
  isValidFileSize(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  },

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Get file extension
  getFileExtension(filename) {
    return filename.split(".").pop()?.toLowerCase();
  },
};

// Score interpretation utilities
export const scoreUtils = {
  // Get score category
  getScoreCategory(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "fair";
    return "poor";
  },

  // Get score color class
  getScoreColorClass(score) {
    const category = this.getScoreCategory(score);
    return `score-${category}`;
  },

  // Get score description
  getScoreDescription(score) {
    const category = this.getScoreCategory(score);
    const descriptions = {
      excellent: "Excellent match! Your resume aligns very well with this job.",
      good: "Good match! Minor optimizations could improve your chances.",
      fair: "Fair match. Consider significant improvements to better align.",
      poor: "Poor match. Major changes needed to meet job requirements.",
    };
    return descriptions[category];
  },

  // Get priority color
  getPriorityColor(priority) {
    const colors = {
      high: "text-danger-600 bg-danger-50",
      medium: "text-warning-600 bg-warning-50",
      low: "text-success-600 bg-success-50",
    };
    return colors[priority] || colors.medium;
  },
};

export default api;
