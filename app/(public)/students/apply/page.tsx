"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { COUNTRIES, EDUCATION_LEVELS, REFERRAL_SOURCES, PROGRAMMES } from "@/lib/learning/countries";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    country: "Kenya",

    // Education & Background
    educationLevel: "",
    institution: "",
    fieldOfStudy: "",

    // Programme Selection
    programme: "Web Development Fundamentals",

    // Motivation & Goals
    motivation: "",
    previousExperience: "",
    learningGoals: "",
    referralSource: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    }

    if (currentStep === 2) {
      if (!formData.educationLevel) newErrors.educationLevel = "Please select your education level";
      if (!formData.institution.trim()) newErrors.institution = "Institution name is required";
      if (!formData.programme) newErrors.programme = "Please select a programme";
    }

    if (currentStep === 3) {
      if (!formData.motivation.trim() || formData.motivation.length < 100)
        newErrors.motivation = "Please provide at least 100 characters explaining why you want to join";
      if (!formData.learningGoals.trim() || formData.learningGoals.length < 50)
        newErrors.learningGoals = "Please provide at least 50 characters describing your learning goals";
      if (!formData.referralSource) newErrors.referralSource = "Please tell us how you heard about us";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);

    try {
      const response = await fetch("/api/learning/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setReferenceNumber(data.referenceNumber);
        setSubmitted(true);
        setStep(4);
      } else {
        console.error("[FORM] Submission failed:", data);
        setErrors({ submit: data.error || "Failed to submit application" });
      }
    } catch (error) {
      console.error("[FORM] Error submitting:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted && step === 4) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-background-light p-8 rounded-xl border border-border text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Application Submitted Successfully!
            </h1>

            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-lg border border-secondary/20 mb-6">
              <p className="text-sm text-text-secondary mb-2">Your Reference Number</p>
              <p className="text-2xl font-bold text-text-primary tracking-wider">
                {referenceNumber}
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Save this number - you'll need it to track your application
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border mb-6 text-left">
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                What Happens Next?
              </h2>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start">
                  <div className="bg-secondary/10 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-secondary text-sm font-bold">1</span>
                  </div>
                  <span>You'll receive a confirmation email with your reference number within a few minutes</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-secondary/10 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-secondary text-sm font-bold">2</span>
                  </div>
                  <span>Our admissions team will review your application within 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-secondary/10 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-secondary text-sm font-bold">3</span>
                  </div>
                  <span>If accepted, you'll receive an email with your login credentials to access the learning platform</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-secondary/10 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-secondary text-sm font-bold">4</span>
                  </div>
                  <span>Once logged in, you can start your learning journey immediately!</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Important:</strong> Check your spam/junk folder if you don't receive the confirmation email within 10 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-secondary hover:text-secondary/80 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Homepage
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Apply to VeyraTech Learning Programme
            </h1>
            <p className="text-text-secondary">
              Join our free learning programme and start your tech career
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                    step >= num ? "bg-secondary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span className={step >= 1 ? "text-secondary font-medium" : ""}>
                Personal Info
              </span>
              <span className={step >= 2 ? "text-secondary font-medium" : ""}>
                Education & Programme
              </span>
              <span className={step >= 3 ? "text-secondary font-medium" : ""}>
                Motivation
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-background-light p-8 rounded-xl border border-border">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Personal Information</h2>
                  <p className="text-text-secondary text-sm mb-6">Tell us about yourself</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.name ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.email ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.phone ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                      placeholder="+254 712 345 678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.dateOfBirth ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                    <p className="mt-1 text-xs text-text-muted">You must be at least 13 years old</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.country ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education & Programme */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Education & Programme Selection</h2>
                  <p className="text-text-secondary text-sm mb-6">Your educational background and programme choice</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Education Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.educationLevel ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                  >
                    <option value="">Select your education level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-500">{errors.educationLevel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Institution Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.institution ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                    placeholder="e.g., University of Nairobi, Strathmore University"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-sm text-red-500">{errors.institution}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Field of Study (if applicable)
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary"
                    placeholder="e.g., Computer Science, Business, Engineering"
                  />
                  <p className="mt-1 text-xs text-text-muted">Leave blank if not applicable</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Select Programme <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="programme"
                    value={formData.programme}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.programme ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                  >
                    {PROGRAMMES.map((programme) => (
                      <option key={programme.value} value={programme.label}>
                        {programme.label} ({programme.duration} - {programme.level})
                      </option>
                    ))}
                  </select>
                  {errors.programme && (
                    <p className="mt-1 text-sm text-red-500">{errors.programme}</p>
                  )}
                  
                  {/* Programme Description */}
                  {formData.programme && (
                    <div className="mt-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <p className="text-sm text-text-secondary">
                        {PROGRAMMES.find(p => p.label === formData.programme)?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Motivation */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Tell Us About Yourself</h2>
                  <p className="text-text-secondary text-sm mb-6">Help us understand your motivation and goals</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Why do you want to join this programme? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.motivation ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary resize-none`}
                    placeholder="Share your motivation for learning software development. What interests you about technology? What problem do you want to solve? Be specific and genuine."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.motivation ? (
                      <p className="text-sm text-red-500">{errors.motivation}</p>
                    ) : (
                      <p className={`text-sm ${formData.motivation.length >= 100 ? 'text-green-600' : 'text-text-muted'}`}>
                        {formData.motivation.length} / 100 characters minimum
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Previous Programming Experience
                  </label>
                  <textarea
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary resize-none"
                    placeholder="Have you coded before? Mention any languages, courses, or projects. If none, just say 'No previous experience' - that's completely fine!"
                  />
                  <p className="mt-1 text-xs text-text-muted">No experience required - this helps us tailor your learning path</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    What are your learning goals? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="learningGoals"
                    value={formData.learningGoals}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.learningGoals ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary resize-none`}
                    placeholder="What do you hope to achieve? Career change? Build a startup? Freelance? Get a job? Be specific."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.learningGoals ? (
                      <p className="text-sm text-red-500">{errors.learningGoals}</p>
                    ) : (
                      <p className={`text-sm ${formData.learningGoals.length >= 50 ? 'text-green-600' : 'text-text-muted'}`}>
                        {formData.learningGoals.length} / 50 characters minimum
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    How did you hear about us? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.referralSource ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-text-primary`}
                  >
                    <option value="">Select an option</option>
                    {REFERRAL_SOURCES.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                  {errors.referralSource && (
                    <p className="mt-1 text-sm text-red-500">{errors.referralSource}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{errors.submit}</p>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Note:</strong> By submitting this application, you confirm that all information provided is accurate and complete.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 bg-background hover:bg-primary/10 text-text-primary font-semibold rounded-lg border border-border transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors ml-auto"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-background-light border border-border rounded-lg">
            <p className="text-sm text-text-secondary text-center">
              Need help? Email us at <a href="mailto:hello@veyratech.co.ke" className="text-secondary hover:underline">hello@veyratech.co.ke</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
