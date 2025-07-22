import React from "react";
import { TrendingUp, Target, Zap, CheckCircle } from "lucide-react";

const Hero = () => {
  const features = [
    {
      icon: Target,
      title: "Accurate Matching",
      description:
        "Get precise match scores based on skills, experience, and certifications",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Receive detailed feedback and suggestions in seconds",
    },
    {
      icon: TrendingUp,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems",
    },
  ];

  const benefits = [
    "Skills & keyword analysis with 95% accuracy",
    "Experience matching based on industry standards",
    "Certification verification and recommendations",
    "Semantic understanding of varied job descriptions",
    "Detailed, actionable improvement suggestions",
    "ATS-friendly formatting recommendations",
  ];

  return (
    <div className="text-center space-y-12 mb-16">
      {/* Main Hero Content */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Optimize Your Resume with
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {" "}
              AI Power
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get an accurate match score between your resume and job
            descriptions. Receive detailed suggestions to improve your chances
            of landing interviews.
          </p>
        </div>

        {/* Key Stats */}
        <div className="flex flex-wrap justify-center gap-8 py-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">95%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">7 sec</div>
            <div className="text-sm text-gray-600">Average Analysis</div>
          </div>
          <div className="text-3xl font-bold text-gray-400">|</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">ATS</div>
            <div className="text-sm text-gray-600">Compatible</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">Multi</div>
            <div className="text-sm text-gray-600">Format Support</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card card-hover text-center space-y-4 animate-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <feature.icon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Why Choose Our Resume Analyzer?
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 animate-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload Resume",
              description:
                "Upload your resume in PDF, DOCX, or paste text directly",
            },
            {
              step: "2",
              title: "Add Job Description",
              description:
                "Paste the job description you want to match against",
            },
            {
              step: "3",
              title: "Get Analysis",
              description:
                "Receive match score and detailed improvement suggestions",
            },
          ].map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                {step.step}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Optimize Your Resume?
        </h3>
        <p className="text-primary-100 mb-6">
          Start analyzing your resume now and improve your job application
          success rate!
        </p>
        <div className="flex justify-center">
          <div className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold animate-pulse">
            ↓ Upload Your Resume Below ↓
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
