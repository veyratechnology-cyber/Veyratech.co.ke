"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    country: "Kenya",
    city: "",

    // Education & Experience
    educationLevel: "",
    institution: "",
    currentOccupation: "",
    programmingExperience: "none",

    // Programme Selection
    programmeId: "web-dev-fundamentals",

    // Motivation
    whyJoin: "",
    goals: "",
    weeklyAvailability: "",
    hasLaptop: "yes",
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
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
    }

    if (currentStep === 2) {
      if (!formData.educationLevel) newErrors.educationLevel = "Please select your education level";
      if (!formData.institution.trim()) newErrors.institution = "Institution name is required";
      if (!formData.currentOccupation.trim()) newErrors.currentOccupation = "Current occupation is required";
    }

    if (currentStep === 3) {
      if (!formData.whyJoin.trim() || formData.whyJoin.length < 50)
        newErrors.whyJoin = "Please provide at least 50 characters";
      if (!formData.goals.trim() || formData.goals.length < 50)
        newErrors.goals = "Please provide at least 50 characters";
      if (!formData.weeklyAvailability.trim())
        newErrors.weeklyAvailability = "Please specify your weekly availability";
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
        body: JSON.stringify({
          ...formData,
          hasLaptop: formData.hasLaptop === "yes",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReferenceNumber(data.referenceNumber);
        setSubmitted(true);
        setStep(4);
      } else {
        setErrors({ submit: data.error || "Failed to submit application" });
      }
    } catch (error) {
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
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email with your reference number</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Our team will review your application within 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span>If accepted, you'll receive account activation instructions</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span>You can then set your password and start learning immediately</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/students"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Learning Portal
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-background hover:bg-primary/10 text-text-primary font-semibold rounded-lg border border-border transition-colors"
              >
                Go to Homepage
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
              href="/students"
              className="inline-flex items-center text-secondary hover:text-secondary/80 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Learning Portal
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Apply to VeyraTech Learning
            </h1>
            <p className="text-text-secondary">
              Complete this application to join our learning programme
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
                Education
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
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Personal Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.fullName ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.email ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.phone ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="+254 712 345 678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.country ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border ${
                        errors.city ? "border-red-500" : "border-border"
                      } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                      placeholder="Nairobi"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education & Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Education & Experience
                </h2>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Education Level *
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.educationLevel ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                  >
                    <option value="">Select your education level</option>
                    <option value="high-school">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-500">{errors.educationLevel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.institution ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="University of Nairobi"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-sm text-red-500">{errors.institution}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Occupation *
                  </label>
                  <input
                    type="text"
                    name="currentOccupation"
                    value={formData.currentOccupation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.currentOccupation ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="Student, Working Professional, etc."
                  />
                  {errors.currentOccupation && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentOccupation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Programming Experience *
                  </label>
                  <select
                    name="programmingExperience"
                    value={formData.programmingExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary text-text-primary"
                  >
                    <option value="none">No experience</option>
                    <option value="beginner">Beginner (less than 1 year)</option>
                    <option value="intermediate">Intermediate (1-2 years)</option>
                    <option value="advanced">Advanced (2+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Do you have access to a laptop? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasLaptop"
                        value="yes"
                        checked={formData.hasLaptop === "yes"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-text-primary">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasLaptop"
                        value="no"
                        checked={formData.hasLaptop === "no"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-text-primary">No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Motivation */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Tell Us About Yourself
                </h2>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Why do you want to join this programme? * (minimum 50 characters)
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.whyJoin ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary resize-none`}
                    placeholder="Share your motivation and interest in learning software development..."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.whyJoin ? (
                      <p className="text-sm text-red-500">{errors.whyJoin}</p>
                    ) : (
                      <p className="text-sm text-text-muted">
                        {formData.whyJoin.length} / 50 characters minimum
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    What are your learning goals? * (minimum 50 characters)
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.goals ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary resize-none`}
                    placeholder="What do you hope to achieve? What kind of projects do you want to build?"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.goals ? (
                      <p className="text-sm text-red-500">{errors.goals}</p>
                    ) : (
                      <p className="text-sm text-text-muted">
                        {formData.goals.length} / 50 characters minimum
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Weekly Availability * (e.g., "10-15 hours per week, evenings and weekends")
                  </label>
                  <input
                    type="text"
                    name="weeklyAvailability"
                    value={formData.weeklyAvailability}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border ${
                      errors.weeklyAvailability ? "border-red-500" : "border-border"
                    } rounded-lg focus:outline-none focus:border-secondary text-text-primary`}
                    placeholder="10-15 hours per week"
                  />
                  {errors.weeklyAvailability && (
                    <p className="mt-1 text-sm text-red-500">{errors.weeklyAvailability}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{errors.submit}</p>
                  </div>
                )}
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
                  Next
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
                      Submitting...
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
        </div>
      </div>
    </div>
  );
}
