"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select, Alert } from "@/components/shared";
import { Calendar, Send, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { INDUSTRIES, CONSULTATION_TYPES, MEETING_TYPES } from "@/lib/constants";

interface SimpleBookingFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  businessChallenge: string;
  consultationTypes: string[];
  meetingType: 'GOOGLE_MEET' | 'PHONE' | 'IN_PERSON';
  preferredDate: string;
  preferredTime: string;
}

const STEPS = [
  { id: 1, title: 'Your Information' },
  { id: 2, title: 'Business Needs' },
  { id: 3, title: 'Schedule Meeting' },
];

export default function SimpleBooking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<SimpleBookingFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    businessChallenge: '',
    consultationTypes: [],
    meetingType: 'GOOGLE_MEET',
    preferredDate: '',
    preferredTime: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConsultationTypeToggle = (type: string) => {
    setFormData((prev) => {
      const types = prev.consultationTypes.includes(type)
        ? prev.consultationTypes.filter((t) => t !== type)
        : [...prev.consultationTypes, type];
      return { ...prev, consultationTypes: types };
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/book-consultation/success?id=${data.id}`);
      } else {
        let errorMessage = "Failed to submit consultation request.";
        
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors = data.details.map((err: any) => 
            err.message
          ).join(', ');
          errorMessage = `Please check: ${fieldErrors}`;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Consultation submission error:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again or call us at +254 745 247 211.",
      });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-primary via-primary-dark to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
              <Calendar size={40} className="text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold mb-6">
              Book Your Consultation
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
              Free 30-minute consultation. No commitment required.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          currentStep > step.id
                            ? 'bg-secondary border-secondary text-white'
                            : currentStep === step.id
                            ? 'border-secondary text-secondary bg-secondary/10'
                            : 'border-border text-text-muted'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check size={24} />
                        ) : (
                          <span className="font-semibold">{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm mt-2 font-medium ${
                        currentStep >= step.id ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-all ${
                          currentStep > step.id ? 'bg-secondary' : 'bg-border'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {submitStatus && (
              <div className="mb-8">
                <Alert
                  type={submitStatus.type}
                  message={submitStatus.message}
                  dismissible
                  onDismiss={() => setSubmitStatus(null)}
                />
              </div>
            )}

            {/* Form Card */}
            <div className="bg-primary rounded-2xl shadow-2xl p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-sora font-bold mb-6">Your Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+254 712 345 678"
                      />
                      <Input
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Ltd"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Business Information */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-sora font-bold mb-6">What Can We Help You With?</h2>
                    
                    <div className="space-y-6">
                      <Select
                        label="Industry (Optional)"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select your industry" },
                          ...INDUSTRIES.map((i) => ({ value: i.value, label: i.label })),
                        ]}
                      />

                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">
                          Areas of Interest (Optional)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CONSULTATION_TYPES.slice(0, 6).map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => handleConsultationTypeToggle(type.value)}
                              className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                                formData.consultationTypes.includes(type.value)
                                  ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                                  : "border-border hover:border-secondary/50"
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        label="What's Your Main Challenge?"
                        name="businessChallenge"
                        value={formData.businessChallenge}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us briefly about the challenge you're facing..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Meeting Schedule */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-sora font-bold mb-6">Schedule Your Meeting</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">
                          Meeting Format
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {MEETING_TYPES.slice(0, 3).map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, meetingType: type.value as 'GOOGLE_MEET' | 'PHONE' | 'IN_PERSON' }))
                              }
                              className={`p-4 rounded-lg border-2 text-center transition-all ${
                                formData.meetingType === type.value
                                  ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                                  : "border-border hover:border-secondary/50"
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Preferred Date (Optional)"
                          name="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        <Input
                          label="Preferred Time (Optional)"
                          name="preferredTime"
                          type="time"
                          value={formData.preferredTime}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="bg-primary-light p-4 rounded-lg border border-border">
                        <p className="text-sm text-text-secondary">
                          <strong>Note:</strong> If your preferred time isn't available, 
                          we'll find the next best slot and confirm with you.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={currentStep === 1}
                    size="lg"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    {currentStep < 3 ? (
                      <>
                        Continue
                        <ArrowRight size={20} />
                      </>
                    ) : isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Booking
                        <Send size={20} />
                      </>
                    )}
                  </Button>
                </div>

                {currentStep === 3 && (
                  <p className="text-center text-sm text-text-muted">
                    By booking, you agree to our consultation terms. We'll never share your information.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Options */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary p-6 rounded-xl text-center">
                <h3 className="font-sora font-semibold text-lg mb-2">Call Us Directly</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Prefer to talk? Call us now
                </p>
                <a
                  href="tel:+254745247211"
                  className="text-secondary hover:underline font-medium text-lg"
                >
                  +254 745 247 211
                </a>
              </div>

              <div className="bg-primary p-6 rounded-xl text-center">
                <h3 className="font-sora font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Send us your requirements
                </p>
                <a
                  href="mailto:consulting@veyratech.co.ke"
                  className="text-secondary hover:underline font-medium text-lg"
                >
                  consulting@veyratech.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
