import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  File,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { fileUtils } from "../services/api";

const FileUpload = ({ onFileUpload, onTextChange, resumeText, resumeFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'text'

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setUploadError(null);

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        setUploadError(error.message || "File upload failed");
        return;
      }

      const file = acceptedFiles[0];

      // Additional validation
      if (!fileUtils.isValidFileType(file)) {
        setUploadError("Please upload PDF, DOCX, DOC, or TXT files only");
        return;
      }

      if (!fileUtils.isValidFileSize(file)) {
        setUploadError("File size must be less than 10MB");
        return;
      }

      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleRemoveFile = () => {
    setUploadError(null);
    onFileUpload(null);
  };

  const handleTextareaChange = (e) => {
    setUploadError(null);
    onTextChange(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Resume
        </h2>
        <p className="text-gray-600">
          Choose how you'd like to provide your resume information
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "text"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Paste Text
          </button>
        </div>
      </div>

      {/* File Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          {!resumeFile ? (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive || dragActive
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />

              <div className="space-y-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                    isDragActive ? "bg-primary-100" : "bg-gray-100"
                  }`}
                >
                  <Upload
                    className={`w-8 h-8 ${
                      isDragActive ? "text-primary-600" : "text-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive
                      ? "Drop your resume here"
                      : "Upload your resume"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <div className="text-sm text-gray-500">
                    Supported formats: PDF, DOCX, DOC, TXT (max 10MB)
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-success-50 border border-success-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-success-100 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-success-900">
                      {resumeFile.name}
                    </h4>
                    <p className="text-sm text-success-700">
                      {fileUtils.formatFileSize(resumeFile.size)} • Uploaded
                      successfully
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-success-600 hover:bg-success-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-danger-900 mb-1">
                    Upload Error
                  </h4>
                  <p className="text-danger-700">{uploadError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Input Tab */}
      {activeTab === "text" && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={resumeText}
              onChange={handleTextareaChange}
              placeholder="Paste your resume text here... Include your contact information, experience, skills, education, and any other relevant details."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {resumeText.length} characters
            </div>
          </div>

          {resumeText.trim() && (
            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-success-900 font-medium">
                  Resume text ready
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <File className="w-5 h-5 mr-2" />
          Tips for Best Results
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Include your complete work experience with specific job titles and
            companies
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            List all your technical skills, programming languages, and tools
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Mention your education, degrees, and relevant certifications
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Use clear formatting and avoid excessive styling for better text
            extraction
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
