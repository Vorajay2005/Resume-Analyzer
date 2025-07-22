import React from "react";
import { Brain, Github, Mail, Shield, Zap, Target } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Resume Analyzer</h3>
                <p className="text-gray-400 text-sm">AI-Powered Job Matching</p>
              </div>
            </div>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Optimize your resume with AI-powered analysis. Get accurate match
              scores, detailed suggestions, and improve your chances of landing
              your dream job.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@resumeanalyzer.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Contact Support</span>
              </a>
              <a
                href="https://github.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">Open Source</span>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Key Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-primary-400" />
                <span>Accurate Match Scoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <Brain className="w-3 h-3 text-primary-400" />
                <span>AI-Powered Analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-primary-400" />
                <span>ATS Optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-primary-400" />
                <span>Instant Results</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-400">10K+</div>
              <div className="text-sm text-gray-400">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400">95%</div>
              <div className="text-sm text-gray-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400">3</div>
              <div className="text-sm text-gray-400">File Formats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2024 Resume Analyzer. All rights reserved. Built with AI for
            better job matching.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Made with ❤️ for job seekers</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
